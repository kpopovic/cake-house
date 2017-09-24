'use strict';

const knex = require('knex');
const _ = require('lodash');

module.exports = {

    add: async function (/** @type {knex} */ db, /** @type {object} */ props) {
        const toInsert = props.map(item => {
            return {
                materialId: item.materialId,
                productId: item.productId,
                quantity: item.quantity
            };
        });

        return db.batchInsert('materials_products', toInsert);
    },

    /**
    * List materials-products link dependent to productId.
    * @param db
    * @param props - { productId: 1 }
    * @returns {Promise}
    */
    list: async function (/** @type {knex} */ db, /** @type {object} */ props) {
        const productId = _.concat([], props.productId);
        const result = await db.select('materialId', 'productId', 'quantity').from("materials_products").whereIn('productId', productId);

        const resultGrouped = _.groupBy(result, function (key) {
            return key.productId;
        });

        const resultTransformed = _.keys(resultGrouped).map(key => {
            const item = resultGrouped[key];

            const materials = item.map(p => {
                return (
                    {
                        id: p.materialId,
                        quantity: p.quantity
                    }
                );
            });

            const result = {
                id: item[0].productId,
                materials: materials
            };

            return result;
        });

        return resultTransformed;
    },

    /**
    * Delete materials-products link dependent to productId.
    * @param db
    * @param props - { productId: 1 }
    * @returns {Promise}
    */
    delete: async function (/** @type {knex} */ db, /** @type {object} */ props) {
        const productId = _.concat([], props.productId);
        return db('materials_products').whereIn('productId', productId).del();
    }
};
