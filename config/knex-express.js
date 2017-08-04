'use strict';

module.exports = function () {
    let knex; // promise

    return function knexDB(req, res, next) {
        if (!knex) {
            try {
                knex = require('./knex-db');
                req['db'] = knex;
                console.info("RDBMS connection established");
                next();
            } catch (err) {
                console.error("No RDBMS connection established! Please check connection string.");
                knex = undefined;
                req['db'] = undefined;
                next(err);
            }
        } else {
            req['db'] = knex;
            next();
        }
    };
};
