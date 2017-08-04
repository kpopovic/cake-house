/**
 * Created by kresimir on 28.06.17..
 */

const express = require('express');
const router = express.Router();
const products = require('../repository/products-db');
const _ = require('lodash');

router.post('/', async function (req, res) {
    try {
        const result = await products.add(req.db, req.userId, req.body); // returns ["x"]
        res.json({ code: 0, type: 'CREATE_PRODUCT', message: 'Product is created', data: { id: parseInt(result[0]) } });
    } catch (err) {
        console.error(err);
        res.json({ code: -1, type: 'CREATE_PRODUCT', message: 'Product is not created' });
    }
});

router.get('/', async function (req, res) {
    try {
        if (req.query.productId) {
            const productIds = _.split(req.query.productId, ' ');
            const result = await products.listById(req.db, req.userId, { productId: productIds });
            const size = result.length;

            if (size === 0) {
                res.json({ code: 0, type: 'LIST_PRODUCT', message: 'No active products listed', data: { products: [] } });
            } else {
                res.json({ code: 0, type: 'LIST_PRODUCT', message: 'Active products are listed', data: { products: result } });
            }

        } else {
            // start and limit query params are optional
            const intStart = parseInt(req.query.start); // NaN if not integer
            const intLimit = parseInt(req.query.limit); // NaN if not integer

            const start = Number.isInteger(intStart) && intStart > 0 ? intStart : 0;
            const maxLimit = 50;
            const limit = Number.isInteger(intLimit) && (intLimit > 0 && intLimit <= maxLimit) ? intLimit : maxLimit;
            const aLimit = limit + 1; // +1 is to see if we have next page

            const props = {
                start: start,
                limit: aLimit
            };

            const result = await products.list(req.db, req.userId, props);
            const size = result.length;

            if (size === 0) {
                res.json({ code: 0, type: 'LIST_PRODUCT', message: 'No active products listed', data: { products: [] } });
            } else if (aLimit === size) {
                const products = _.slice(result, 0, limit);
                const nextStart = _.last(products).id;
                res.json({ code: 0, type: 'LIST_PRODUCT', message: 'Active products are listed', data: { products: products, nextStart: nextStart } });
            } else {
                res.json({ code: 0, type: 'LIST_PRODUCT', message: 'Active products are listed', data: { products: result } });
            }
        }
    } catch (err) {
        console.error(err);
        res.json({ code: -1, type: 'LIST_PRODUCT', message: 'Active products cant be listed' });
    }
});

module.exports = router;
