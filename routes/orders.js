/**
 * Created by kresimir on 18.07.17..
 */

const express = require('express');
const router = express.Router();
const orders = require('../repository/orders-db');
const _ = require('lodash');

router.post('/', async function (req, res) {
    try {
        const result = await orders.add(req.db, req.userId, req.body);
        res.json({ code: 0, type: 'CREATE_ORDER', message: 'Order is created', data: { id: result } });
    } catch (err) {
        console.error(err);
        res.json({ code: -1, type: 'CREATE_ORDER', message: 'Order is not created' });
    }
});

router.put('/', async function (req, res) {
    try {
        const orderId = parseInt(req.query.orderId); // NaN if not integer
        const toUpdate = Object.assign({ id: orderId }, req.body);
        const result = await orders.update(req.db, req.userId, toUpdate);
        res.json({ code: 0, type: 'UPDATE_MATERIAL', message: 'Material', data: { id: result } });
    } catch (err) {
        console.error(err);
        res.json({ code: -1, type: 'UPDATE_MATERIAL', message: 'Order is not updated' });
    }
});

router.get('/', async function (req, res) {
    try {
        const intStart = parseInt(req.query.start); // NaN if not integer
        const intLimit = parseInt(req.query.limit); // NaN if not integer
        const direction = req.query.direction === 'back' ? 'back' : 'next';

        const start = Number.isInteger(intStart) && intStart > 0 ? intStart : 0;
        const maxLimit = 50;
        const limit = Number.isInteger(intLimit) && (intLimit > 0 && intLimit <= maxLimit) ? intLimit : maxLimit;
        const aLimit = limit + 1; // +1 is to see if we have next page

        const props = {
            start: start,
            direction: direction,
            limit: aLimit
        };

        const result = await orders.list(req.db, req.userId, props);
        const size = result.length;

        if (size === 0) {
            res.json({ code: 0, type: 'LIST_ORDER', message: 'No active orders listed', data: { orders: [] } });
        } else if (aLimit === size) {
            const orders = _.slice(result, 0, limit);
            const leftOff = _.last(orders).id;
            res.json({ code: 0, type: 'LIST_ORDER', message: 'Active orders are listed', data: { orders: orders, leftOff: leftOff } });
        } else {
            res.json({ code: 0, type: 'LIST_ORDER', message: 'Active orders are listed', data: { orders: result } });
        }

    } catch (err) {
        console.error(err);
        res.json({ code: -1, type: 'LIST_ORDER', message: 'Active orders cant be listed' });
    }
});

module.exports = router;
