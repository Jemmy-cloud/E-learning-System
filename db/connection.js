exports.openConnection = () => {
    const knex = require('knex')({
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: 'khokhe&duke@mysql89',
            database: 'university'
        }
    });

    return knex
}