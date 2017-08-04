'use strict';

const knex = require('knex');
const _ = require('lodash');

module.exports = {

    add: async function (/** @type {knex} */ db, /** @type {object} */ props) {
        const toInsert = props.map(item => {
            return {
                productId: item.productId,
                orderId: item.orderId,
                quantity: item.quantity
            };
        });

        return db.batchInsert('products_orders', toInsert);
    },

    /**
    * List products-orders link dependent to orderId.
    * @param db
    * @param props - { orderId: 1 }
    * @returns {Promise}
    *
    * @example
    *
    * [
    *      {
    *        "id": 1,
    *        "products": [{"id": 1, "quantity": 2}, {"id": 3, "quantity": 4}, {"id": 5, "quantity": 3}]
    *      },
    *       {
    *        "id": 2,
    *        "products": [{"id": 1, "quantity": 2}]
    *      },
    * ]
    *
    */
    list: async function (/** @type {knex} */ db, /** @type {object} */ props) {
        const orderIds = Array.of(props.orderId);
        const result = await db.select('productId', 'orderId', 'quantity').from("products_orders").whereIn('orderId', orderIds);

        const resultGrouped = _.groupBy(result, function (key) {
            return key.orderId;
        });

        const resultTransformed = _.keys(resultGrouped).map(key => {
            const item = resultGrouped[key];

            const products = item.map(p => {
                return (
                    {
                        id: p.productId,
                        quantity: p.quantity
                    }
                );
            });

            const result = {
                id: item[0].orderId,
                products: products
            };

            return result;
        });

        return resultTransformed;
    },

    /**
    * Delete products-orders link dependent to productId.
    * @param db
    * @param props - { orderId: 1 }
    * @returns {Promise}
    */
    delete: async function (/** @type {knex} */ db, /** @type {object} */ props) {
        const orderId = Array.of(props.orderId);
        return db('products_orders').whereIn('orderId', orderId).del();
    }
};
