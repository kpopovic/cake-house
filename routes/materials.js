/**
 * Created by kresimir on 28.06.17..
 */

const express = require('express');
const router = express.Router();
const materials = require('../repository/materials-db');
const _ = require('lodash');

router.post('/', async function (req, res) {
    try {
        const result = await materials.add(req.db, req.userId, req.body); // returns ["x"]
        res.json({ code: 0, type: 'CREATE_MATERIAL', message: 'Material is created', data: { id: parseInt(result[0]) } });
    } catch (err) {
        console.error(err);
        res.json({ code: -1, type: 'CREATE_MATERIAL', message: 'Material is not created' });
    }
});

router.put('/', async function (req, res) {
    try {
        const materialId = parseInt(req.query.materialId); // NaN if not integer
        const toUpdate = Object.assign({ id: materialId }, req.body);
        const result = await materials.update(req.db, req.userId, toUpdate);
        res.json({ code: 0, type: 'UPDATE_MATERIAL', message: 'Material is updated', data: { id: result } });
    } catch (err) {
        console.error(err);
        res.json({ code: -1, type: 'UPDATE_MATERIAL', message: 'Material is not updated' });
    }
});

router.get('/', async function (req, res) {
    try {
        const leftOff = parseInt(req.query.leftOff); // NaN if not integer
        const limit = _.get(req, 'query.limit', 10);
        const direction = _.get(req, 'query.direction', 'first');
        const filterName = _.get(req, 'query.filter.name', '%');
        const filterIsQuantityToBuy = _.get(req, 'query.filter.isQuantityToBuy', false);

        const props = {
            leftOff: leftOff,
            direction: direction,
            limit: limit,
            filter: {
                name: filterName,
                isQuantityToBuy: filterIsQuantityToBuy
            }
        };

        const result = await materials.list(req.db, req.userId, props);

        if (result.length === 0) {
            res.json({ code: 0, type: 'LIST_MATERIAL', message: 'No active materials listed', data: { materials: [] } });
        } else {
            res.json({ code: 0, type: 'LIST_MATERIAL', message: 'Active materials are listed', data: { materials: result } });
        }

    } catch (err) {
        console.error(err);
        res.json({ code: -1, type: 'LIST_MATERIAL', message: 'Active materials cant be listed' });
    }
});

module.exports = router;
