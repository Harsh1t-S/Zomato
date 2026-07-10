const { Sequelize } = require('sequelize');

const db = new Sequelize('Zomato', 'root', '12345', {

    host: 'localhost',
    dialect: 'mysql',
});

module.exports = db;