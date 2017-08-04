const express = require('express');
const router = express.Router();
const users = require('../repository/users-db');
const auth = require('basic-auth');

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log("users path");
  res.send('respond with a resource');
});

router.post('/', async function (req, res, next) {
  try {
    const user = auth(req);
    const props = {
      name: req.body.name,
      username: user.name,
      password: user.pass
    };
    const result = await users.add(req.db, props);
    res.json({ code: 0, type: 'CREATE_USER', message: 'User is created', data: { id: parseInt(result[0]) } });
  } catch (err) {
    console.error(err);
    res.json({ code: -1, type: 'CREATE_USER', message: 'User is not created' });
  }
});

module.exports = router;
