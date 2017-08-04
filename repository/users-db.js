'use strict';

const knex = require('knex');

module.exports = {

    /**
    * Returns user id.
    * @param db
    * @param username
    * @param password
    * @returns {Promise}
    */
    userId: async function (/** @type {knex} */ db, /** @type {string} */ username, /** @type {string} */ password) {
        return db.select('id').from('users').where('username', username).where('password', password).limit(1);
    },

    add: async function (/** @type {knex} */ db, /** @type {knex} */ props) {
        return db('users').returning('id').insert(props);
    }

};