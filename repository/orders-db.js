'use strict';

const knex = require('knex');
const products = require('./products-db');
const materialsDB = require('./materials-db');
//const materials_products = require('./materials-products-db');
const products_orders = require('./products-orders-db');
const _ = require('lodash');
const moment = require('moment');

module.exports = {

    /**
    * Add new order in pending state.
    * @param db
    * @param userId
    * @returns {Promise}
    */
    add: async function (/** @type {knex} */ db, /** @type {number} */ userId, /** @type {object} */ props) {
        const theProps = {
            name: props.name,
            userId: userId,
            clientName: props.clientName,
            clientPhone: props.clientPhone,
            deliveryDate: props.deliveryDate,
            products: props.products,
            state: 'pending'
        };

        return db.transaction(async tx => {
            const toInsert = _.omit(theProps, _.isUndefined, _.isNull, 'products');
            const insertResult = await tx.insert(toInsert).into('orders').returning('id');
            const orderId = parseInt(insertResult[0]);

            const bridgeToInsert = theProps.products.map(product => {
                return {
                    productId: product.id,
                    orderId: orderId,
                    quantity: product.quantity
                };
            });

            await products_orders.add(tx, bridgeToInsert);

            return orderId;
        });
    },

    /**
     * Update current order.
     *
     * {
     *    id: 1,
     *    name: 'Order Name Update',
     *    clientName: 'Bunny',
     *    clientPhone: '00000000001',
     *    deliveryDate: <YYYY-MM-DD HH:mm:ss>,
     *    products: [{ id: 1, quantity: 2 }, { id: 2, quantity: 3 }],
     *    state: 'pending|production'
     * }
     *
     */
    update: async function (/** @type {knex} */ db, /** @type {number} */ userId, /** @type {object} */ props) {
        const tmpProps = {
            id: props.id,
            name: props.name,
            clientName: props.clientName,
            clientPhone: props.clientPhone,
            deliveryDate: props.deliveryDate,
            products: props.products,
            state: props.state,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        };

        const theProps = _.omit(tmpProps, _.isUndefined, _.isNull);

        const orderId = theProps.id;
        const isNewProductsAvailable = Array.isArray(theProps.products) && theProps.products.length > 0;

        return db.transaction(async tx => {
            const toUpdate = _.omit(theProps, ['id', 'products']);
            const updateResult = await tx('orders').where('userId', userId).where('id', orderId).whereNull('deactivated_at').update(toUpdate);

            if (isNewProductsAvailable) {
                // delete products assigned to current order because new ones will be set
                const deleteResult = await products_orders.delete(tx, { orderId: orderId });

                const bridgeToInsert = theProps.products.map(product => {
                    return {
                        productId: product.id,
                        orderId: orderId,
                        quantity: product.quantity
                    };
                });

                // assign new products to current order
                await products_orders.add(tx, bridgeToInsert);
            }

        });
    },

    /**
     * Set orders state from production to done.
     * This is only possible to do if there is enought material in the stock for production process.
     *
     * {
     *    id: 1
     * }
     *
     */
    finishOrder: async function (/** @type {knex} */ db, /** @type {number} */ userId, /** @type {object} */ props) {
        const orderId = props.id;

        // find all products in this order
        const orders = await this.listById(db, userId, { orderId: orderId });
        const productIds = _.head(orders).products.map(p => p.id);
        const productList = await products.listById(db, userId, { productId: productIds });

        // collect all materials from all products in this order
        const materials = _.flattenDeep(productList.map(p => p.materials));
        const materialsGrouped = _.groupBy(materials, function (key) {
            return key.id;
        });

        const toUpdate = _.keys(materialsGrouped).map(key => {
            const materials = materialsGrouped[key]; // all with the same material id
            const materialsHead = _.head(materials);
            const materialId = materialsHead.id;
            const materialName = materialsHead.name;
            const quantityInStock = materialsHead.quantityInStock;
            const quantityRequiredForProductionSum = _.sumBy(materials, 'quantityRequiredForProduction');
            const newQuantityInStock = quantityInStock - quantityRequiredForProductionSum;

            return { id: materialId, name: materialName, quantityInStock: newQuantityInStock };
        });

        // validate if all materialsTransformed.quantityInStock are > 0
        const errorList = toUpdate.filter(m => m.quantityInStock < 0);
        if (!_.isEmpty(errorList)) {
            return -1;
        }

        return db.transaction(async tx => {
            const orderUpdate = await module.exports.update(tx, userId, { id: orderId, state: 'done' });
            const materialUpdateResultPromise = toUpdate.map(async material => {
                return materialsDB.update(tx, userId, { id: material.id, quantityInStock: material.quantityInStock });
            });

            return Promise.all(materialUpdateResultPromise);
        });

    },

    /**
    * Find orders by id.
    * @param db
    * @param userId
    * @param props
    * @example
    *   props={orderId: 1}
    * @example
    *   props={orderId: [2,3,4]}
    * @returns {Promise}
    *
    * @example
    *
    * [
    *  {
    *    "id": 1,
    *    "name": "Order1",
    *    "clientName": "Client2",
    *    "clientPhone": "Phone2",
    *    "deliveryDate": "2017-08-02",
    *    "state": "pending|production|done",
    *    "products": [
    *      {
    *        "id": 1,
    *        "name": "Product1",
    *        "quantity": 2
    *      },
    *      {
    *        "id": 4,
    *        "name": "Product4",
    *        "quantity": 5
    *      }
    *    ]
    *  },
    *  {
    *   ...
    *  }
    * ]
    *
    */
    listById: async function (/** @type {knex} */ db, /** @type {number} */ userId, /** @type {object} */ props) {
        const orderIds = Array.of(props.orderId);

        const result = await db.select(
            'o.id',
            'o.name',
            'o.clientName',
            'o.clientPhone',
            'o.deliveryDate',
            'o.state',
            'p.id AS productId',
            'p.name AS productName',
            'po.quantity AS productQuantity')
            .from('orders AS o')
            .innerJoin('products_orders AS po', 'po.orderId', '=', 'o.id')
            .innerJoin('products AS p', 'p.id', '=', 'po.productId')
            .whereIn("o.id", orderIds)
            .orderBy('o.id', 'asc');

        const resultGrouped = _.groupBy(result, function (key) {
            return key.name;
        });

        const resultTransformed = _.keys(resultGrouped).map(key => {
            const order = resultGrouped[key];

            const products = order.map(p => {
                return (
                    {
                        'id': p.productId,
                        'name': p.productName,
                        'quantity': p.productQuantity
                    }
                );
            });

            const result = {
                'id': order[0].id,
                'name': order[0].name,
                'clientName': order[0].clientName,
                'clientPhone': order[0].clientPhone,
                'deliveryDate': order[0].deliveryDate,
                'state': order[0].state,
                'products': products
            };

            return result;
        });

        return resultTransformed;

    },

    /**
    * Return only active orders.
    * @param db
    * @param userId
    * @param props
    * @returns {Promise}
    *
    * @example
    *
    * [
    *  {
    *    "id": 1,
    *    "name": "Order1",
    *    "clientName": "Client2",
    *    "clientPhone": "Phone2",
    *    "deliveryDate": "2017-08-02",
    *    "state": "pending|production|done",
    *    "products": [
    *      {
    *        "id": 1,
    *        "name": "Product1",
    *        "quantity": 2
    *      },
    *      {
    *        "id": 4,
    *        "name": "Product4",
    *        "quantity": 5
    *      }
    *    ]
    *  },
    *  {
    *   ...
    *  }
    * ]
    *
    *
    */
    list: async function (/** @type {knex} */ db, /** @type {number} */ userId, /** @type {object} */ props) {
        const { leftOff, direction, limit, filter } = props;
        const ORDER = (direction === 'first' || direction === 'next') ? 'asc' : 'desc';

        const orderIdsAsPromise = () => {
            if (direction === 'first') {
                return db.select('id')
                    .from('orders')
                    .where('userId', userId)
                    .whereNull("deactivated_at")
                    .where('name', 'like', `${filter.name}`)
                    .where('state', 'like', `${filter.state}`)
                    .andWhereBetween('deliveryDate', [filter.deliveryDate.from, filter.deliveryDate.to])
                    .orderBy('id', ORDER)
                    .limit(limit);
            } else if (direction === 'next') {
                return db.select('id')
                    .from('orders')
                    .where('userId', userId)
                    .where("id", ">", leftOff)
                    .whereNull("deactivated_at")
                    .where('name', 'like', `${filter.name}`)
                    .where('state', 'like', `${filter.state}`)
                    .andWhereBetween('deliveryDate', [filter.deliveryDate.from, filter.deliveryDate.to])
                    .orderBy('id', ORDER)
                    .limit(limit);
            } else if (direction === 'back') {
                return db.select('id')
                    .from('orders')
                    .where('userId', userId)
                    .where("id", "<", leftOff)
                    .whereNull("deactivated_at")
                    .where('name', 'like', `${filter.name}`)
                    .where('state', 'like', `${filter.state}`)
                    .andWhereBetween('deliveryDate', [filter.deliveryDate.from, filter.deliveryDate.to])
                    .orderBy('id', ORDER)
                    .limit(limit);
            }
        };

        const result = await orderIdsAsPromise();

        if (result.length === 0) {
            return [];
        };

        const orderIds = _.orderBy(result).map(m => m.id);
        const orderResult = await db.select(
            'o.id',
            'o.name',
            'o.clientName',
            'o.clientPhone',
            'o.deliveryDate',
            'o.state',
            'p.id AS productId',
            'p.name AS productName',
            'po.quantity AS productQuantity')
            .from('orders AS o')
            .innerJoin('products_orders AS po', 'po.orderId', '=', 'o.id')
            .innerJoin('products AS p', 'p.id', '=', 'po.productId')
            .whereIn("o.id", orderIds)
            .orderBy('o.id', ORDER);

        const resultGrouped = _.groupBy(orderResult, function (key) {
            return key.name;
        });

        const resultTransformed = _.keys(resultGrouped).map(key => {
            const order = resultGrouped[key];

            const products = order.map(p => {
                return (
                    {
                        'id': p.productId,
                        'name': p.productName,
                        'quantity': p.productQuantity
                    }
                );
            });

            const result = {
                'id': order[0].id,
                'name': order[0].name,
                'clientName': order[0].clientName,
                'clientPhone': order[0].clientPhone,
                'deliveryDate': order[0].deliveryDate,
                'state': order[0].state,
                'products': products
            };

            return result;
        });

        return resultTransformed;
    },

    /**
     * Deactivate order.
     * @param db
     * @param userId
     * @param props
     */
    deactivate: async function (/** @type {knex} */ db, /** @type {number} */ userId, /** @type {object} */ props) {
        const orderId = props.orderId;
        const toUpdate = {
            deactivated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        };

        return db("orders").where('userId', userId).where('id', orderId).whereNull('deactivated_at').update(toUpdate);
    }
}
