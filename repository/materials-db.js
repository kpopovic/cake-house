'use strict';

const knex = require('knex');
const moment = require('moment');
const _ = require('lodash');

module.exports = {

    /**
    * Return only active materials dependent to material id(s).
    * @param db
    * @param userId
    * @param props
    * @example
    *   props = {materialId: 1}
    *   props = {materialId: [1,2,3,4]}
    * @returns {Promise}
    *
    * @example
    * [
    *   {
    *     "id": 2,
    *     "name": "DummyMaterial2",
    *     "quantityInStock": 199.99,
    *     "quantityInPending": 2384.00,
    *     "quantityInProduction": 0.00,
    *     "quantityInDone": 0.00,
    *     "quantityToBuy": 0.00
    *   },
    *   {
    *      "id": 3,
    *      "name": "DummyMaterial4",
    *      "quantityInStock": 399.99,
    *      "quantityInPending": 1725.00,
    *      "quantityInProduction": 0.00,
    *      "quantityInDone": 0.00,
    *      "quantityToBuy": 0.00
    *    },...
    * ]
    *
    */
    listById: async function (/** @type {knex} */ db, /** @type {number} */ userId, /** @type {object} */ props) {
        const materialIds = _.concat([], props.materialId);

        let subQuery = [];
        subQuery.push(
            '(',
            'SELECT',
            'm.userId, m.id, m.name, m.unit, m.quantityInStock,',

            'CASE WHEN state = "pending" THEN',
            'SUM(po.quantity * mp.quantity)',
            'ELSE 0',
            'END',
            'AS quantityInPending,',

            'CASE WHEN state = "production" THEN',
            'SUM(po.quantity * mp.quantity)',
            'ELSE 0',
            'END',
            'AS quantityInProduction,',

            'CASE WHEN state = "done" THEN',
            'SUM(po.quantity * mp.quantity)',
            'ELSE 0',
            'END',
            'AS quantityInDone,',

            'CASE WHEN state = "production" AND (m.quantityInStock - SUM(po.quantity * mp.quantity) ) < 0 THEN',
            '(SUM(po.quantity * mp.quantity) - m.quantityInStock)',
            'ELSE 0',
            'END',
            'AS quantityToBuy',

            'FROM materials AS m LEFT JOIN materials_products AS mp ON mp.materialid = m.id',
            'LEFT JOIN products_orders AS po ON po.productid = mp.productid',
            'LEFT JOIN orders AS o ON o.id = po.orderid',
            'WHERE',
            'm.deactivated_at IS NULL',
            'AND',
            `m.userId = ${userId}`,
            'AND',
            `m.id IN ( ${materialIds} )`,
            'GROUP BY userid, id, state',
            ') AS X'
        );

        return db.select(
            'id',
            'name',
            'unit',
            'quantityInStock',
            db.raw('SUM(quantityInPending) AS quantityInPending'),
            db.raw('SUM(quantityInProduction) AS quantityInProduction'),
            db.raw('SUM(quantityInDone) AS quantityInDone'),
            db.raw('SUM(quantityToBuy) AS quantityToBuy')
        ).from(db.raw(subQuery.join(' ')))
            .groupBy('userId', 'id');

    },

    /**
    * Return only active materials.
    * @param db
    * @param userId
    * @param props
    * @example
    *
    * props = {
    *  leftOff = 10, // can be NaN !
    *  direction = 'next' | 'back' | 'first'
    *  limit = 10
    * }
    * @returns {Promise}
    */
    list: async function (/** @type {knex} */ db, /** @type {number} */ userId, /** @type {object} */ props) {
        const { leftOff, direction, limit, filter } = props;
        const ORDER = (direction === 'first' || direction === 'next') ? 'asc' : 'desc';

        const materialIdsAsPromise = () => {
            if (direction === 'first') {
                if (filter.name) {
                    return db.select('id')
                        .from('materials')
                        .where('userId', userId)
                        .whereNull("deactivated_at")
                        .where('name', 'like', `${filter.name}`)
                        .orderBy('id', ORDER)
                        .limit(limit);
                } else {
                    return db.select('id')
                        .from('materials')
                        .where('userId', userId)
                        .whereNull("deactivated_at")
                        .orderBy('id', ORDER)
                        .limit(limit);
                }
            } else if (direction === 'next') {
                if (filter.name) {
                    return db.select('id')
                        .from('materials')
                        .where('userId', userId)
                        .where("id", ">", leftOff)
                        .whereNull("deactivated_at")
                        .where('name', 'like', `${filter.name}`)
                        .orderBy('id', ORDER)
                        .limit(limit);
                } else {
                    return db.select('id')
                        .from('materials')
                        .where('userId', userId)
                        .where("id", ">", leftOff)
                        .whereNull("deactivated_at")
                        .orderBy('id', ORDER)
                        .limit(limit);
                }
            } else if (direction === 'back') {
                if (filter.name) {
                    return db.select('id')
                        .from('materials')
                        .where('userId', userId)
                        .where("id", "<", leftOff)
                        .whereNull("deactivated_at")
                        .where('name', 'like', `${filter.name}`)
                        .orderBy('id', ORDER)
                        .limit(limit);
                } else {
                    return db.select('id')
                        .from('materials')
                        .where('userId', userId)
                        .where("id", "<", leftOff)
                        .whereNull("deactivated_at")
                        .orderBy('id', ORDER)
                        .limit(limit);
                }
            }
        };

        const result = await materialIdsAsPromise();

        if (result.length === 0) {
            return [];
        };

        const materialIdsJoined = result.map(m => m.id).join();

        let subQuery = [];
        subQuery.push(
            '(',
            'SELECT',
            'm.userId, m.id, m.name, m.unit, m.quantityInStock,',

            'CASE WHEN state = "pending" THEN',
            'SUM(po.quantity * mp.quantity)',
            'ELSE 0',
            'END',
            'AS quantityInPending,',

            'CASE WHEN state = "production" THEN',
            'SUM(po.quantity * mp.quantity)',
            'ELSE 0',
            'END',
            'AS quantityInProduction,',

            'CASE WHEN state = "done" THEN',
            'SUM(po.quantity * mp.quantity)',
            'ELSE 0',
            'END',
            'AS quantityInDone,',

            'CASE WHEN state = "production" AND (m.quantityInStock - SUM(po.quantity * mp.quantity) ) < 0 THEN',
            '(SUM(po.quantity * mp.quantity) - m.quantityInStock)',
            'ELSE 0',
            'END',
            'AS quantityToBuy',

            'FROM materials AS m LEFT JOIN materials_products AS mp ON mp.materialid = m.id',
            'LEFT JOIN products_orders AS po ON po.productid = mp.productid',
            'LEFT JOIN orders AS o ON o.id = po.orderid',
            'WHERE',
            'm.deactivated_at IS NULL',
            'AND',
            `m.id IN ( ${materialIdsJoined} )`,
            'GROUP BY userid, id, state',
            ') AS X'
        );

        return db.select(
            'id',
            'name',
            'unit',
            'quantityInStock',
            db.raw('SUM(quantityInPending) AS quantityInPending'),
            db.raw('SUM(quantityInProduction) AS quantityInProduction'),
            db.raw('SUM(quantityInDone) AS quantityInDone'),
            db.raw('SUM(quantityToBuy) AS quantityToBuy')
        ).from(db.raw(subQuery.join(' ')))
            .groupBy('userId', 'id')
            .orderBy('id', ORDER);
    },

    /**
     * Add new material.
     * @param db
     * @param userId
     * @param props
     * @returns {Promise}
     */
    add: async function (/** @type {knex} */ db, /** @type {number} */ userId, props) {
        const toInsert = Object.assign({ userId: userId }, props);
        return db('materials').returning('id').insert(toInsert);
    },

    /**
    * Update current material.
    * @param db
    * @param userId
    * @param props
    * @returns {Promise}
    */
    update: async function (/** @type {knex} */ db, /** @type {number} */ userId, props) {
        const tmpProps = {
            id: props.id,
            name: props.name,
            unit: props.unit,
            quantityInStock: props.quantityInStock,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        };

        const theProps = _.omit(tmpProps, _.isUndefined, _.isNull);
        const materialId = tmpProps.id;
        const toUpdate = _.omit(theProps, ['id']);

        return db("materials").where('id', materialId).whereNull('deactivated_at').update(toUpdate);
    },

    /**
     * Deactivate material.
     * @param db
     * @param userId
     * @param props
     */
    deactivate: async function (/** @type {knex} */ db, /** @type {number} */ userId, /** @type {object} */ props) {
        const materialId = props.materialId;
        const toUpdate = {
            deactivated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        };

        return db("materials").where('userId', userId).where('id', materialId).whereNull('deactivated_at').update(toUpdate);
    }

};
