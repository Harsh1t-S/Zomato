const db = require('../Config/db');
const { DataTypes } = require('sequelize');

const Orders = db.define('orders', {
    Orderid: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
    },
    number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    restrauntName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    orderedItems: {
        type: DataTypes.JSON,
        allowNull: false
    },
    ItemPrices: {
        type: DataTypes.JSON,
        allowNull: false
    }
}, {
    timestamps: true,
});

module.exports = Orders;