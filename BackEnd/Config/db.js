const { Sequelize } = require('sequelize');

const db = new Sequelize('mysql://root:DGQmoGkQwmtRrwquDtKHWWJRzOYIFvjX@hayabusa.proxy.rlwy.net:20154/railway', {
    dialect: 'mysql',
    logging: false
});

module.exports = db;
