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
    },
    // Payment tracking (Razorpay). 'cod' covers orders placed while the
    // payment gateway is disabled (RAZORPAY_ENABLED != 'true'), so existing
    // behavior keeps working if it's ever turned off.
    paymentStatus: {
        type: DataTypes.ENUM('cod', 'paid', 'failed'),
        allowNull: false,
        defaultValue: 'cod',
    },
    paymentId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    razorpayOrderId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
});

module.exports = Orders;