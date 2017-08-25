/**
 * Created by kresimir on 28.06.17..
 */

'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();
const _ = require('lodash');
const moment = require('moment');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

// http://stackabuse.com/testing-node-js-code-with-mocha-and-chai/
// https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai
// https://github.com/chaijs/chai-http

describe('Main test', () => {
    const dummyData = require('./dummy-data');
    const agent = chai.request.agent(app);

    it('(re)create all db tables', async function () {
        const res = await dummyData.prepareDB();
        expect(res).to.be.a('string');
        expect(res).to.equal('All tables created');
    });

    it('fill dummy data', async function () {
        const res1 = await dummyData.fillDummyUsers(agent);
        expect(res1).to.be.a('object');
        expect(res1.code).to.equal(0);
        expect(res1.data.id).to.equal(1);

        const materials = await dummyData.fillDummyMaterials(agent);
        expect(materials.length).to.equal(10);

        const products = await dummyData.fillDummyProducts(agent, materials, 20);
        expect(products.length).to.equal(20);

        const orders = await dummyData.fillDummyOrders(agent, products, 30);
        expect(orders.length).to.equal(30);

    });

    it('get default (direction=first) active materials', async function () {
        const result = await dummyData.defaultMaterialList(agent);
        expect(result.data.materials.length).to.equal(10);

        result.data.materials.forEach(material => {
            expect(material).to.haveOwnProperty('id');
            expect(material).to.haveOwnProperty('name');
            expect(material).to.haveOwnProperty('unit');
            expect(material).to.haveOwnProperty('quantityInStock');
            expect(material).to.haveOwnProperty('quantityInPending');
            expect(material).to.haveOwnProperty('quantityInProduction');
            expect(material).to.haveOwnProperty('quantityInDone');
            expect(material).to.haveOwnProperty('quantityToBuy');
        });

    });

    it('get first 10 active materials', async function () {
        const result = await dummyData.firstMaterialList(agent, 10);
        expect(result.data.materials.length).to.equal(10);

        result.data.materials.forEach(material => {
            expect(material).to.haveOwnProperty('id');
            expect(material).to.haveOwnProperty('name');
            expect(material).to.haveOwnProperty('unit');
            expect(material).to.haveOwnProperty('quantityInStock');
            expect(material).to.haveOwnProperty('quantityInPending');
            expect(material).to.haveOwnProperty('quantityInProduction');
            expect(material).to.haveOwnProperty('quantityInDone');
            expect(material).to.haveOwnProperty('quantityToBuy');
        });

    });

    it('active materials pagination, direction=next and direction=back', async function () {
        const checkProps = function (materials) {
            materials.forEach(material => {
                expect(material).to.haveOwnProperty('id');
                expect(material).to.haveOwnProperty('name');
                expect(material).to.haveOwnProperty('unit');
                expect(material).to.haveOwnProperty('quantityInStock');
                expect(material).to.haveOwnProperty('quantityInPending');
                expect(material).to.haveOwnProperty('quantityInProduction');
                expect(material).to.haveOwnProperty('quantityInDone');
                expect(material).to.haveOwnProperty('quantityToBuy');
            });
        };

        // ----------------------- NEXT -----------------------
        const result1 = await dummyData.firstMaterialList(agent, 4);
        expect(result1.data.materials.length).to.equal(4);
        checkProps(result1.data.materials);
        const leftOff1 = _.maxBy(result1.data.materials, function (o) { return o.id }).id;
        expect(leftOff1).to.equal(4);

        const result2 = await dummyData.paginationMaterialList(agent, 'next', leftOff1, 4);
        expect(result2.data.materials.length).to.equal(4);
        checkProps(result2.data.materials);
        const leftOff2 = _.maxBy(result2.data.materials, function (o) { return o.id }).id;
        expect(leftOff2).to.equal(8);

        const result3 = await dummyData.paginationMaterialList(agent, 'next', leftOff2, 2);
        expect(result3.data.materials.length).to.equal(2);
        checkProps(result3.data.materials);
        const minLeftOff3 = _.minBy(result3.data.materials, function (o) { return o.id }).id; // start point for 'back' direction
        const maxLeftOff3 = _.maxBy(result3.data.materials, function (o) { return o.id }).id;
        expect(maxLeftOff3).to.equal(10);

        // ----------------------- BACK -----------------------
        const result4 = await dummyData.paginationMaterialList(agent, 'back', minLeftOff3, 4);
        expect(result4.data.materials.length).to.equal(4);
        checkProps(result4.data.materials);
        const leftOff4 = _.minBy(result4.data.materials, function (o) { return o.id }).id;
        expect(leftOff4).to.equal(5);

        const result5 = await dummyData.paginationMaterialList(agent, 'back', leftOff4, 4);
        expect(result5.data.materials.length).to.equal(4);
        checkProps(result5.data.materials);
        const leftOff5 = _.minBy(result5.data.materials, function (o) { return o.id }).id;
        expect(leftOff5).to.equal(1);

    });

    it('update material', async function () {
        const currentMaterials1 = await dummyData.defaultMaterialList(agent);
        const material = _.head(currentMaterials1.data.materials);
        const materialId = material.id;

        const newMaterial = {
            id: materialId,
            name: 'Material Name Update',
            unit: 'L',
            quantityInStock: 100.01
        };

        await dummyData.updateMaterial(agent, newMaterial);

        const currentMaterials2 = await dummyData.defaultMaterialList(agent);
        const newCurrentMaterial = _.head(currentMaterials2.data.materials);

        expect(newCurrentMaterial.id).to.equal(materialId);
        expect(newCurrentMaterial.name).to.equal(newMaterial.name);
        expect(newCurrentMaterial.quantityInStock).to.equal(newMaterial.quantityInStock);
        expect(newCurrentMaterial.unit).to.equal(newMaterial.unit);
    });

    it('get default (direction=first) active products', async function () {
        const result = await dummyData.defaultProductList(agent);
        expect(result.data.products.length).to.equal(10);

        result.data.products.forEach(product => {
            expect(product).to.haveOwnProperty('id');
            expect(product).to.haveOwnProperty('name');
            expect(product).to.haveOwnProperty('materials');
            expect(product.materials).not.empty;

            product.materials.forEach(material => {
                expect(material).to.haveOwnProperty('id');
                expect(material).to.haveOwnProperty('name');
                expect(material).to.haveOwnProperty('unit');
                expect(material).to.haveOwnProperty('quantityInStock');
                expect(material).to.haveOwnProperty('quantityInPending');
                expect(material).to.haveOwnProperty('quantityInProduction');
                expect(material).to.haveOwnProperty('quantityInDone');
                expect(material).to.haveOwnProperty('quantityToBuy');
                expect(material).to.haveOwnProperty('quantityRequiredForProduction');
            });

        });

    });

    it('get first 20 active products', async function () {
        const result = await dummyData.firstProductList(agent, 20);
        expect(result.data.products.length).to.equal(20);

        result.data.products.forEach(product => {
            expect(product).to.haveOwnProperty('id');
            expect(product).to.haveOwnProperty('name');
            expect(product).to.haveOwnProperty('materials');
            expect(product.materials).not.empty;

            product.materials.forEach(material => {
                expect(material).to.haveOwnProperty('id');
                expect(material).to.haveOwnProperty('name');
                expect(material).to.haveOwnProperty('unit');
                expect(material).to.haveOwnProperty('quantityInStock');
                expect(material).to.haveOwnProperty('quantityInPending');
                expect(material).to.haveOwnProperty('quantityInProduction');
                expect(material).to.haveOwnProperty('quantityInDone');
                expect(material).to.haveOwnProperty('quantityToBuy');
                expect(material).to.haveOwnProperty('quantityRequiredForProduction');
            });

        });

    });

    /*it('get selected active products', async function () {
        const result = await dummyData.defaultProductList(agent);
        expect(result.data.products.length).to.equal(20);

        const firstProductId = _.head(result.data.products).id;
        const lastProductId = _.last(result.data.products).id;

        const selectedProductList = await dummyData.selectedProductList(agent, [lastProductId, lastProductId]);

        selectedProductList.data.products.forEach(product => {
            expect(product).to.haveOwnProperty('id');
            expect(product).to.haveOwnProperty('name');
            expect(product).to.haveOwnProperty('materials');
            expect(product.materials).not.empty;

            product.materials.forEach(material => {
                expect(material).to.haveOwnProperty('id');
                expect(material).to.haveOwnProperty('name');
                expect(material).to.haveOwnProperty('unit');
                expect(material).to.haveOwnProperty('quantityInStock');
                expect(material).to.haveOwnProperty('quantityInPending');
                expect(material).to.haveOwnProperty('quantityInProduction');
                expect(material).to.haveOwnProperty('quantityInDone');
                expect(material).to.haveOwnProperty('quantityToBuy');
                expect(material).to.haveOwnProperty('quantityRequiredForProduction');
            });

        });

    });*/

    it('active products pagination, limit = 9', async function () {
        // ----------------------- NEXT -----------------------
        const result1 = await dummyData.firstProductList(agent, 9);
        expect(result1.data.products.length).to.equal(9);
        const leftOff1 = _.maxBy(result1.data.products, function (o) { return o.id }).id;
        expect(leftOff1).to.equal(9);

        const result2 = await dummyData.paginationProductList(agent, 'next', leftOff1, 9);
        expect(result2.data.products.length).to.equal(9);
        const leftOff2 = _.maxBy(result2.data.products, function (o) { return o.id }).id;
        expect(leftOff2).to.equal(18);

        const result3 = await dummyData.paginationProductList(agent, 'next', leftOff2, 2);
        expect(result3.data.products.length).to.equal(2);
        const minLeftOff3 = _.minBy(result3.data.products, function (o) { return o.id }).id; // start point for 'back' direction
        const maxLeftOff3 = _.maxBy(result3.data.products, function (o) { return o.id }).id;
        expect(minLeftOff3).to.equal(19);
        expect(maxLeftOff3).to.equal(20);

        // ----------------------- BACK -----------------------
        const result4 = await dummyData.paginationProductList(agent, 'back', minLeftOff3, 9);
        expect(result4.data.products.length).to.equal(9);
        const leftOff4 = _.minBy(result4.data.products, function (o) { return o.id }).id;
        expect(leftOff4).to.equal(10);

        const result5 = await dummyData.paginationProductList(agent, 'back', leftOff4, 9);
        expect(result5.data.products.length).to.equal(9);
        const minLeftOff5 = _.minBy(result5.data.products, function (o) { return o.id }).id;
        const maxLeftOff5 = _.maxBy(result5.data.products, function (o) { return o.id }).id;
        expect(minLeftOff5).to.equal(1);
        expect(maxLeftOff5).to.equal(9);
    });

    it('update product', async function () {
        const currentProducts1 = await dummyData.defaultProductList(agent);
        const product = _.head(currentProducts1.data.products);
        const productId = product.id;

        const currentMaterials = await dummyData.defaultMaterialList(agent);
        const firstMaterialId = _.head(currentMaterials.data.materials).id;
        const lastMaterialId = _.last(currentMaterials.data.materials).id;

        const newProduct = {
            id: productId,
            name: 'Product Name Update',
            materials: [{ id: firstMaterialId, quantity: 4.50 }, { id: lastMaterialId, quantity: 6.75 }]
        };

        await dummyData.updateProduct(agent, newProduct);

        const currentProducts2 = await dummyData.defaultProductList(agent);
        const newCurrentProduct = _.head(currentProducts2.data.products);

        expect(newCurrentProduct.id).to.equal(productId);
        expect(newCurrentProduct.name).to.equal(newProduct.name);

        newCurrentProduct.materials.forEach(material => {
            expect(material).to.haveOwnProperty('id');
            expect(material).to.haveOwnProperty('name');
            expect(material).to.haveOwnProperty('unit');
            expect(material).to.haveOwnProperty('quantityInStock');
            expect(material).to.haveOwnProperty('quantityInPending');
            expect(material).to.haveOwnProperty('quantityInProduction');
            expect(material).to.haveOwnProperty('quantityInDone');
            expect(material).to.haveOwnProperty('quantityToBuy');
            expect(material).to.haveOwnProperty('quantityRequiredForProduction');
        });

        const f1 = _.filter(newCurrentProduct.materials, { quantityRequiredForProduction: 4.5 });
        expect(f1).not.empty
        expect(f1.length).to.equal(1);

        const f2 = _.filter(newCurrentProduct.materials, { quantityRequiredForProduction: 6.75 });
        expect(f2).not.empty
        expect(f1.length).to.equal(1);

    });

    it('get first 30 active orders', async function () {
        const result = await dummyData.defaultOrderList(agent);
        expect(result.data.orders).not.empty;
        expect(result.data.orders.length).to.equal(30);

        result.data.orders.forEach(order => {
            expect(order).to.haveOwnProperty('id');
            expect(order).to.haveOwnProperty('name');
            expect(order).to.haveOwnProperty('clientName');
            expect(order).to.haveOwnProperty('clientPhone');
            expect(order).to.haveOwnProperty('deliveryDate');
            expect(order).to.haveOwnProperty('state');
            expect(order.products).not.empty;

            order.products.forEach(product => {
                expect(product).to.haveOwnProperty('id');
                expect(product).to.haveOwnProperty('name');
                expect(product).to.haveOwnProperty('quantity');
            });

        });

    });

    it('active orders pagination, limit = 9', async function () {
        const result1 = await dummyData.paginationOrderList(agent, 0, 9);
        expect(result1.data.orders.length).to.equal(9);
        expect(result1.data).to.haveOwnProperty('leftOff');
        const leftOff1 = result1.data.leftOff;

        const result2 = await dummyData.paginationOrderList(agent, leftOff1, 9);
        expect(result2.data.orders.length).to.equal(9);
        expect(result2.data).to.haveOwnProperty('leftOff');
        const leftOff2 = result2.data.leftOff;

        const result3 = await dummyData.paginationOrderList(agent, leftOff2, 9);
        expect(result3.data.orders.length).to.equal(9);
        expect(result3.data).to.haveOwnProperty('leftOff');
        const leftOff3 = result3.data.leftOff;

        const result4 = await dummyData.paginationOrderList(agent, leftOff3, 3);
        expect(result4.data.orders.length).to.equal(3);
        expect(result4.data).to.not.haveOwnProperty('leftOff');
    });

    it('update order, state: pending -> production', async function () {
        const currentOrders = await dummyData.defaultOrderList(agent);
        const order = _.head(currentOrders.data.orders);
        const orderId = order.id;
        const currentProducts = await dummyData.defaultProductList(agent);

        const firstProductId = _.head(currentProducts.data.products).id;
        const lastProductId = _.last(currentProducts.data.products).id;

        const newOrder = {
            id: orderId,
            name: 'Order Name Update',
            clientName: 'Bunny',
            clientPhone: '00000000001',
            deliveryDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            products: [{ id: firstProductId, quantity: 2 }, { id: lastProductId, quantity: 3 }],
            state: 'production'
        };

        const result = await dummyData.updateOrder(agent, newOrder);
        expect(currentOrders.data.orders.length).to.equal(30);
    });

});
