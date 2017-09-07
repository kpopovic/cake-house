/**
 * Created by kresimir on 18.07.17..
 */

const express = require('express');
const router = express.Router();
const orders = require('../repository/orders-db');

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

        const result = await orders.list(req.db, req.userId, props);

        if (result.length === 0) {
            res.json({ code: 0, type: 'LIST_ORDER', message: 'No active orders listed', data: { orders: [] } });
        } else {
            res.json({ code: 0, type: 'LIST_ORDER', message: 'Active orders are listed', data: { orders: result } });
        }

    } catch (err) {
        console.error(err);
        res.json({ code: -1, type: 'LIST_ORDER', message: 'Active orders cant be listed' });
    }
});

module.exports = router;
