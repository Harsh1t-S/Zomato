const { Sequelize } = require('sequelize');

const db = new Sequelize('Zomato', 'root', 'DGQmoGkQwmtRrwquDtKHWWJRzOYIFvjX', {

    host: 'localhost',
    dialect: 'mysql',
});

module.exports = db;
