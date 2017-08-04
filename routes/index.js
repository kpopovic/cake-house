var express = require('express');
var router = express.Router();

const materials = require('../repository/materials-db');

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const a = await materials.list(req.db, 1);
    console.log(a);
  } catch (err) {

  }
  res.render('index', { title: 'Express' });
});

module.exports = router;
