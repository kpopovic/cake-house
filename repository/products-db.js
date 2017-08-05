'use strict';

const knex = require('knex');
const materials = require('./materials-db');
const materials_products = require('./materials-products-db');
const moment = require('moment');
const _ = require('lodash');

module.exports = {

    /**
      * [
      *  {name: Product1, materials: [{id: 1, quantity: 10.11},  {id: 2, quantity: 10.13}]},
      *  {name: Product2, materials: [{id: 4, quantity: 110.11}, {id: 5, quantity: 10.31}]},
      *  {name: Product3, materials: [{id: 7, quantity: 120.11}, {id: 8, quantity: 10.41}]}
      * ]
      * @param db
      * @param userId
      * @param props
      * @returns {Promise}
      */
    add: async function (/** @type {knex} */ db, /** @type {number} */ userId, /** @type {object} */ props) {
        const toInsert = {
            name: props.name,
            userId: userId
        };

        return db.transaction(async tx => {
            const insertResult = await tx.insert(toInsert).into('products').returning('id');
            const productId = parseInt(insertResult[0]);

            const bridgeToInsert = props.materials.map(material => {
                return {
                    materialId: material.id,
                    productId: productId,
                    quantity: material.quantity
                };
            });

            await tx.batchInsert('materials_products', bridgeToInsert); // max 1000 rows

            return insertResult;
        });

    },

    /**
    * Update current product.
    * @param db
    * @param userId
    * @param props
    * @returns {Promise}
    */
    update: async function (/** @type {knex} */ db, /** @type {number} */ userId, props) {
        const tmpProps = {
            id: props.id,
            name: props.name,
            materials: props.materials,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        };

        const theProps = _.omit(tmpProps, _.isUndefined, _.isNull);
        const productId = tmpProps.id;

        const isNewMaterialsAvailable = Array.isArray(theProps.materials) && theProps.materials.length > 0;

        return db.transaction(async tx => {
            const toUpdate = _.omit(theProps, ['id', 'materials']);
            const updateResult = await tx('products').where('userId', userId).where('id', productId).whereNull('deactivated_at').update(toUpdate);

            if (isNewMaterialsAvailable) {
                // delete materials assigned to current product because new ones will be set
                const deleteResult = await materials_products.delete(tx, { productId: productId });

                const bridgeToInsert = theProps.materials.map(material => {
                    return {
                        materialId: material.id,
                        productId: productId,
                        quantity: material.quantity
                    };
                });

                // assign new products to current order
                await materials_products.add(tx, bridgeToInsert);
            }

        });
    },

    /**
    * Return only active products.
    * @param db
    * @param userId
    * @param props
    * @example
    *
    * props = {productId: 1}
    * props = {productId: [1,2,3]}
    *
    * @returns {Promise}
    *
    * @example
    *
    * [
    *  {
    *      "id": 1,
    *      "name": "Product4",
    *      "materials": [
    *      {
    *        "id": 2,
    *        "name": "DummyMaterial2",
    *        "quantityInStock": 199.99,
    *        "quantityInPending": 2878.00,
    *        "quantityInProduction": 0.00,
    *        "quantityInDone": 0.00,
    *        "quantityToBuy": 0.00
    *      },
    *      {
    *        "id": 3,
    *        "name": "DummyMaterial3",
    *        "quantityInStock": 299.99,
    *        "quantityInPending": 1718.00,
    *        "quantityInProduction": 0.00,
    *        "quantityInDone": 0.00,
    *        "quantityToBuy": 0.00
    *      }
    *     ]
    *  },
    *  {
    *   ....
    *  }
    * ]
    *
    */
    listById: async function (/** @type {knex} */ db, /** @type {number} */ userId, /** @type {object} */ props) {
        const productIds = Array.of(props.productId);

        const productsResult = await db.select(
            'p.id',
            'p.name',
            'm.id AS mId')
            .from('products AS p')
            .innerJoin('materials_products AS mp', 'mp.productId', '=', 'p.id')
            .innerJoin('materials AS m', 'm.id', '=', 'mp.materialId')
            .whereIn("p.id", productIds)
            .orderBy('p.id', 'asc')
            .orderBy('p.name', 'asc');

        const materialIds = productsResult.map(p => p.mId);
        const materialsResult = await materials.listById(db, userId, { materialId: materialIds });

        const resultGrouped = _.groupBy(productsResult, function (key) {
            return key.name;
        });

        const resultTransformed = _.keys(resultGrouped).map(key => {
            const product = resultGrouped[key];

            const materials = _.filter(materialsResult, function (m) {
                const isFound = _.some(product, { mId: m.id });
                if (isFound) {
                    return m;
                }
            });

            const result = {
                'id': product[0].id,
                'name': product[0].name,
                'materials': materials
            };

            return result;
        });

        return resultTransformed;
    },

    /**
     * Return only active products.
     * @param db
     * @param userId
     * @param props
     * @returns {Promise}
     *
     * @example
     *
     * [
     *  {
     *      "id": 1,
     *      "name": "Product4",
     *      "materials": [
     *      {
     *        "id": 2,
     *        "name": "DummyMaterial2",
     *        "quantityInStock": 199.99,
     *        "quantityInPending": 2878.00,
     *        "quantityInProduction": 0.00,
     *        "quantityInDone": 0.00,
     *        "quantityToBuy": 0.00
     *      },
     *      {
     *        "id": 3,
     *        "name": "DummyMaterial3",
     *        "quantityInStock": 299.99,
     *        "quantityInPending": 1718.00,
     *        "quantityInProduction": 0.00,
     *        "quantityInDone": 0.00,
     *        "quantityToBuy": 0.00
     *      }
     *     ]
     *  },
     *  {
     *   ....
     *  }
     * ]
     *
     */
    list: async function (/** @type {knex} */ db, /** @type {number} */ userId, /** @type {object} */ props) {
        const start = props.start;
        const limit = props.limit;

        const ids = await db.select('id')
            .from('products')
            .where('userId', userId)
            .where("id", ">", start)
            .whereNull("deactivated_at")
            .orderBy('id', 'asc')
            .limit(limit);

        if (ids.length === 0) {
            return [];
        };

        const productIds = _.map(ids, 'id');
        const productsResult = await db.select(
            'p.id',
            'p.name',
            'm.id AS mId')
            .from('products AS p')
            .innerJoin('materials_products AS mp', 'mp.productId', '=', 'p.id')
            .innerJoin('materials AS m', 'm.id', '=', 'mp.materialId')
            .whereIn("p.id", productIds)
            .orderBy('p.id', 'asc')
            .orderBy('p.name', 'asc');

        const materialIds = productsResult.map(p => p.mId);
        const materialsResult = await materials.listById(db, userId, { materialId: materialIds });
        const mpResult = await materials_products.list(db, { productId: productIds });

        const resultGrouped = _.groupBy(productsResult, function (key) {
            return key.name;
        });

        const resultTransformed = _.keys(resultGrouped).map(key => {
            const product = resultGrouped[key];
            const materialsWithNeededQuantity = _.filter(mpResult, { 'id': product[0].id });

            const materials = _.filter(materialsResult, function (m) {
                const isFound = _.some(product, { mId: m.id });
                if (isFound) {
                    const filteredMaterials = _.head(materialsWithNeededQuantity).materials;
                    const filteredQuantity = _.filter(filteredMaterials, { id: m.id });
                    const quantity = _.head(filteredQuantity).quantity;
                    return Object.assign(m, { quantityNeededForThisProduct: quantity });
                }
            });

            const result = {
                'id': product[0].id,
                'name': product[0].name,
                'materials': materials
            };

            return result;
        });

        return resultTransformed;
    },

    /**
    * Deactivate products.
    * @param db
    * @param userId
    * @param props
    */
    deactivate: async function (/** @type {knex} */ db, /** @type {number} */ userId, /** @type {object} */ props) {
        const productId = props.productId;
        const toUpdate = {
            deactivated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        };

        return db("products").where('userId', userId).where('id', productId).whereNull('deactivated_at').update(toUpdate);
    }

};
