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

router.put('/', async function (req, res) {
    try {
        const productId = parseInt(req.query.productId); // NaN if not integer
        const toUpdate = Object.assign({ id: productId }, req.body);
        const result = await products.update(req.db, req.userId, toUpdate);
        res.json({ code: 0, type: 'UPDATE_PRODUCT', message: 'Product is updated', data: { id: result } });
    } catch (err) {
        console.error(err);
        res.json({ code: -1, type: 'UPDATE_PRODUCT', message: 'Product is not updated' });
    }
});

router.get('/', async function (req, res) {
    try {
        const leftOff = parseInt(req.query.leftOff); // NaN if not integer
        const filterName = req.query.filter ? req.query.filter.name : null;

        const direction = (value, defaultValue) => {
            if (value === 'first' || value === 'next' || value === 'back') {
                return value;
            } else {
                return defaultValue;
            }
        };

        const limit = (value, defaultValue) => {
            const maxLimit = 100; // protection limit
            const intValue = parseInt(value);
            if (Number.isInteger(intValue) && intValue > 0 && intValue <= maxLimit) {
                return intValue;
            } else {
                return defaultValue;
            }
        };

        const props = {
            leftOff: leftOff,
            direction: direction(req.query.direction, 'first'),
            limit: limit(req.query.limit, 10),
            filter: {
                name: filterName
            }
        };

        const result = await products.list(req.db, req.userId, props);

        if (result.length === 0) {
            res.json({ code: 0, type: 'LIST_PRODUCT', message: 'No active products listed', data: { products: [] } });
        } else {
            res.json({ code: 0, type: 'LIST_PRODUCT', message: 'Active products are listed', data: { products: result } });
        }

    } catch (err) {
        console.error(err);
        res.json({ code: -1, type: 'LIST_PRODUCT', message: 'Active products cant be listed' });
    }
});

module.exports = router;
