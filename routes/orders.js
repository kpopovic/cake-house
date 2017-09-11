/**
 * Created by kresimir on 18.07.17..
 */

const express = require('express');
const router = express.Router();
const orders = require('../repository/orders-db');
const _ = require('lodash');
const moment = require('moment');

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
        const filterName = _.get(req, 'query.filter.name', '%');
        const filterState = _.get(req, 'query.filter.state', '%');
        const direction = _.get(req, 'query.direction', 'first');
        const limit = _.get(req, 'query.limit', 10);
        const fromDeliveryDate = _.get(req, 'query.filter.fromDeliveryDate', moment().subtract(1, 'month').format('YYYY-MM-DD'));
        const toDeliveryDate = _.get(req, 'query.filter.toDeliveryDate', moment().add(3, 'month').format('YYYY-MM-DD'));

        const props = {
            leftOff: leftOff,
            direction: direction,
            limit: limit,
            filter: {
                name: filterName,
                state: filterState,
                deliveryDate: {
                    from: fromDeliveryDate,
                    to: toDeliveryDate
                }
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
