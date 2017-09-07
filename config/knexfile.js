module.exports = {

    development: {
        client: 'mysql', // https://github.com/mysqljs/mysql
        debug: true,
        connection: {
            host: '127.0.0.1',
            user: 'root',
            timezone: 'utc',
            //password: '<no password in DEV mode>',
            database: 'cakehouse',
            charset: 'utf8'
        },
        pool: {
            min: 1,
            max: 5
        },
    }

};
