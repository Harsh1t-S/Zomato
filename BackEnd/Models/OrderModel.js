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
    restrauntId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    orderedItems: {
        type: DataTypes.JSON,
        allowNull: false
    },
    ItemPrices: {
        type: DataTypes.JSON,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('placed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'),
        allowNull: false,
        defaultValue: 'placed'
    }
}, {
    timestamps: true,
});

module.exports = Orders;