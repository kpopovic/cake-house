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

        const result = await materials.list(req.db, req.userId, props);
        const size = result.length;

        if (size === 0) {
            res.json({ code: 0, type: 'LIST_MATERIAL', message: 'No active materials listed', data: { materials: [] } });
        } else if (aLimit === size) {
            const materials = _.slice(result, 0, limit); // remove last record
            const nextStart = _.last(materials).id;
            res.json({ code: 0, type: 'LIST_MATERIAL', message: 'Active materials are listed', data: { materials: materials, nextStart: nextStart } });
        } else {
            res.json({ code: 0, type: 'LIST_MATERIAL', message: 'Active materials are listed', data: { materials: result } });
        }

    } catch (err) {
        console.error(err);
        res.json({ code: -1, type: 'LIST_MATERIAL', message: 'Active materials cant be listed' });
    }
});

module.exports = router;
