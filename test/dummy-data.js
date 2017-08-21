const db = require('../config/knex-db');
const moment = require('moment');
const _ = require('lodash');

// username: demo, password: demo
const COOKIE = 'cakehouse=s%3Aj%3A%7B%22userId%22%3A1%7D.dQe6z7QxadlcxLCr96QuNRBMepgwZwSkdBI9ikI1k7c;';

let materials = [
    {
        name: 'DummyMaterial1',
        unit: 'kg',
        quantityInStock: 99.99
    },
    {
        name: 'DummyMaterial2',
        unit: 'L',
        quantityInStock: 199.99
    },
    {
        name: 'DummyMaterial3',
        unit: 'kg',
        quantityInStock: 299.99
    },
    {
        name: 'DummyMaterial4',
        unit: 'L',
        quantityInStock: 399.99
    },
    {
        name: 'DummyMaterial5',
        unit: 'kg',
        quantityInStock: 499.99
    },
    {
        name: 'DummyMaterial6',
        unit: 'L',
        quantityInStock: 599.99
    },
    {
        name: 'DummyMaterial7',
        unit: 'kg',
        quantityInStock: 699.99
    },
    {
        name: 'DummyMaterial8',
        unit: 'L',
        quantityInStock: 799.99
    },
    {
        name: 'DummyMaterial9',
        unit: 'kg',
        quantityInStock: 899.99
    },
    {
        name: 'DummyMaterial10',
        unit: 'L',
        quantityInStock: 999.99
    }
];


module.exports = {

    dropTableUsers: function () {
        return db.schema.dropTableIfExists('users');
    },

    dropTableMaterials: function () {
        return db.schema.dropTableIfExists('materials');
    },

    dropTableProducts: function () {
        return db.schema.dropTableIfExists('products');
    },

    dropTableMaterialsProducts: function () {
        return db.schema.dropTableIfExists('materials_products');
    },

    dropTableOrders: function () {
        return db.schema.dropTableIfExists('orders');
    },

    dropTableProductsOrders: function () {
        return db.schema.dropTableIfExists('products_orders');
    },

    dropAllTables: async function () {
        await module.exports.dropTableProductsOrders();
        await module.exports.dropTableMaterialsProducts();
        await module.exports.dropTableOrders();
        await module.exports.dropTableProducts();
        await module.exports.dropTableMaterials();
        await module.exports.dropTableUsers();
    },

    createTableUsers: function () {
        return new Promise(function (resolve, reject) {
            db.schema.createTable('users', function (table) {
                table.increments();
                table.string('name').unique().notNullable();
                table.string('username').unique().notNullable();
                table.string('password').notNullable();
                table.dateTime('created_at').defaultTo(db.fn.now()).notNullable();
                table.dateTime('updated_at').defaultTo(db.fn.now()).notNullable();

                table.index(['username', 'password'], 'users_idx1');

            }).then(function (res) {
                resolve("ok")
            }).catch(function (err) {
                console.log(err);
                reject(err);
            });
        });
    },

    createTableMaterials: function () {
        return new Promise(function (resolve, reject) {
            db.schema.createTable('materials', function (table) {
                table.increments();
                table.string('name').notNullable();
                table.enum('unit', ['kg', 'L']).notNullable();
                table.integer('userId').unsigned().references('id').inTable('users').notNullable();
                table.decimal('quantityInStock').unsigned().notNullable().defaultTo(0);
                table.dateTime('created_at').defaultTo(db.fn.now()).notNullable();
                table.dateTime('updated_at').defaultTo(db.fn.now()).notNullable();
                table.dateTime('deactivated_at').nullable();

                table.index(['userId', 'deactivated_at'], 'materials_idx1');

            }).then(function (res) {
                resolve("ok")
            }).catch(function (err) {
                console.log(err);
                reject(err);
            });
        });
    },

    createTableProducts: function () {
        return new Promise(function (resolve, reject) {
            db.schema.createTable('products', function (table) {
                table.increments();
                table.string('name').notNullable();
                table.integer('userId').unsigned().references('id').inTable('users').notNullable();
                table.dateTime('created_at').defaultTo(db.fn.now()).notNullable();
                table.dateTime('updated_at').defaultTo(db.fn.now()).notNullable();
                table.dateTime('deactivated_at').nullable();

                table.index(['userId', 'deactivated_at'], 'products_idx1');

            }).then(function (res) {
                resolve("ok")
            }).catch(function (err) {
                console.log(err);
                reject(err);
            });
        });
    },

    createTableMaterialsProducts: function () {
        return new Promise(function (resolve, reject) {
            db.schema.createTable('materials_products', function (table) {
                table.integer('materialId').unsigned().references('id').inTable('materials').notNullable();
                table.integer('productId').unsigned().references('id').inTable('products').notNullable();
                table.decimal('quantity').unsigned().notNullable().defaultTo(0);
            }).then(function (res) {
                resolve("ok")
            }).catch(function (err) {
                console.log(err);
                reject(err);
            });
        });
    },

    createTableOrders: function () {
        return new Promise(function (resolve, reject) {
            db.schema.createTable('orders', function (table) {
                table.increments();
                table.string('name').notNullable();
                table.integer('userId').unsigned().references('id').inTable('users').notNullable();
                table.string('clientName').notNullable();
                table.string('clientPhone');
                table.date('deliveryDate').notNullable();
                table.enum('state', ['pending', 'production', 'done']).notNullable().defaultTo('pending');
                table.dateTime('created_at').defaultTo(db.fn.now()).notNullable();
                table.dateTime('updated_at').defaultTo(db.fn.now()).notNullable();
                table.dateTime('deactivated_at').nullable();

                table.index(['userId', 'deactivated_at'], 'orders_idx1');

            }).then(function (res) {
                resolve("ok")
            }).catch(function (err) {
                console.log(err);
                reject(err);
            });
        });
    },

    createTableProductsOrders: function () {
        return new Promise(function (resolve, reject) {
            db.schema.createTable('products_orders', function (table) {
                table.integer('productId').unsigned().references('id').inTable('products').notNullable();
                table.integer('orderId').unsigned().references('id').inTable('orders').notNullable();
                table.integer('quantity').unsigned().notNullable().defaultTo(1);
            }).then(function (res) {
                resolve("ok")
            }).catch(function (err) {
                console.log(err);
                reject(err);
            });
        });
    },

    prepareDB: async function () {
        try {
            await module.exports.dropAllTables();
            await module.exports.createTableUsers();
            await module.exports.createTableMaterials();
            await module.exports.createTableProducts();
            await module.exports.createTableMaterialsProducts();
            await module.exports.createTableOrders();
            await module.exports.createTableProductsOrders();

            return "All tables created";
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    fillDummyUsers: async function (agent) {
        const props = {
            "name": 'Kolacic d.o.o'
        };
        const response = await agent.post('/v1/user').auth('demo', 'demo').send(props);
        return response.body;
    },

    fillDummyMaterials: function (agent) {
        return new Promise(function (resolve, reject) {
            const materialPromises = materials.map(material => {
                return agent.post('/v1/material').set('Cookie', COOKIE).send(material);
            });

            Promise.all(materialPromises).then(function (res) {
                materials.forEach((material, index) => {
                    const body = JSON.parse(res[index].text);
                    material.id = body.data.id;
                });

                resolve(materials);
            }).catch(function (err) {
                console.log(err);
                reject(err);
            });

        });
    },

    fillDummyProducts: function (agent, materials, nrOfProducts) {
        let products = [];

        for (let index = 0; index < nrOfProducts; index++) {
            let maxIndex = Math.floor((Math.random() * materials.length) + 1);
            maxIndex = maxIndex === 1 ? 2 : maxIndex; // no empty materials possible
            const newMaterials = materials.slice(1, maxIndex).map(material => {
                const maxQuantity = Math.floor((Math.random() * 5) + 1);
                return { id: material.id, quantity: parseFloat(maxQuantity) };
            });

            const product = { name: 'Product' + index, materials: newMaterials };
            products.push(product);
        }

        return new Promise(function (resolve, reject) {
            const productPromises = products.map(product => {
                return agent.post('/v1/product').set('Cookie', COOKIE).send(product);
            });

            Promise.all(productPromises).then(function (res) {
                products.forEach((product, index) => {
                    const body = JSON.parse(res[index].text);
                    product.id = body.data.id;
                });

                resolve(products);
            }).catch(function (err) {
                console.log(err);
                reject(err);
            });

        });
    },

    fillDummyOrders: function (agent, products, nrOfOrders) {
        let orders = [];

        for (let index = 0; index < nrOfOrders; index++) {
            let maxIndex = Math.floor((Math.random() * products.length) + 1);
            maxIndex = maxIndex === 1 ? 2 : maxIndex; // no empty product possible
            const newProducts = products.slice(1, maxIndex).map(product => {
                const maxQuantity = Math.floor((Math.random() * 5) + 1);
                return { id: product.id, quantity: parseInt(maxQuantity) };
            });

            const order = {
                name: 'Order' + index,
                products: newProducts,
                clientName: 'Client' + index,
                clientPhone: 'Phone' + index,
                deliveryDate: moment().format('YYYY-MM-DD HH:mm:ss')
            };

            orders.push(order);
        }

        return new Promise(function (resolve, reject) {
            const orderPromises = orders.map(order => {
                return agent.post('/v1/order').set('Cookie', COOKIE).send(order);
            });

            Promise.all(orderPromises).then(function (res) {
                orders.forEach((order, index) => {
                    const body = JSON.parse(res[index].text);
                    order.id = body.data.id;
                });

                resolve(orders);
            }).catch(function (err) {
                console.log(err);
                reject(err);
            });

        });
    },

    defaultMaterialList: async function (agent) {
        const result = await agent.get('/v1/material').set('Cookie', COOKIE);
        return result.body;
    },

    firstMaterialList: async function (agent, limit) {
        const result = await agent.get(`/v1/material?direction=first&limit=${limit}`).set('Cookie', COOKIE);
        return result.body;
    },

    paginationMaterialList: async function (agent, direction, leftOff, limit) {
        const result = await agent.get(`/v1/material?direction=${direction}&leftOff=${leftOff}&limit=${limit}`).set('Cookie', COOKIE);
        return result.body;
    },

    defaultProductList: async function (agent) {
        const result = await agent.get('/v1/product').set('Cookie', COOKIE);
        return result.body;
    },

    paginationProductList: async function (agent, start, limit) {
        const result = await agent.get(`/v1/product?start=${start}&limit=${limit}`).set('Cookie', COOKIE);
        return result.body;
    },

    selectedProductList: async function (agent, productId) {
        const productIds = Array.of(productId);
        const productIdsJoined = _.join(productIds, '+');
        const result = await agent.get(`/v1/product?productId=${productIdsJoined}`).set('Cookie', COOKIE);
        return result.body;
    },

    defaultOrderList: async function (agent) {
        const result = await agent.get('/v1/order').set('Cookie', COOKIE);
        return result.body;
    },

    paginationOrderList: async function (agent, start, limit) {
        const result = await agent.get(`/v1/order?start=${start}&limit=${limit}`).set('Cookie', COOKIE);
        return result.body;
    },

    updateMaterial: async function (agent, props) {
        const materialId = props.id;
        const result = await agent.put(`/v1/material?materialId=${materialId}`).set('Cookie', COOKIE).send(props);
        return result.body;
    },

    updateProduct: async function (agent, props) {
        const productId = props.id;
        const result = await agent.put(`/v1/product?productId=${productId}`).set('Cookie', COOKIE).send(props);
        return result.body;
    },

    updateOrder: async function (agent, props) {
        const orderId = props.id;
        const result = await agent.put(`/v1/order?orderId=${orderId}`).set('Cookie', COOKIE).send(props);
        return result.body;
    },
};
