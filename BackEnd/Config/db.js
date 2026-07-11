require('dotenv').config();
const { Sequelize } = require('sequelize');

if (!process.env.DATABASE_URL) {
    console.error('FATAL: DATABASE_URL is not set. Create a .env file (see .env.example).');
    process.exit(1);
}

const db = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: false
});

module.exports = db;
