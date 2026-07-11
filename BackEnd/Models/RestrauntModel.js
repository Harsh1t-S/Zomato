const db = require('../Config/db');
const { DataTypes } = require('sequelize');

const Restaurant = db.define('restaurants', {
    id: {
        type: DataTypes.STRING, 
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.STRING,
    },
    cuisine: {
        type: DataTypes.JSON, 
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    deliveryTime: {
        type: DataTypes.STRING, 
    },
    priceForTwo: {
        type: DataTypes.INTEGER,
    },
    distance: {
        type: DataTypes.STRING,
    },
    image: {
        type: DataTypes.STRING,
    },
    pureVeg: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    promoted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    offer: {
        type: DataTypes.STRING,
    },
    phone: {
        type: DataTypes.STRING,
    },
    hours: {
        type: DataTypes.STRING,
    },
    menu: {
        type: DataTypes.JSON, 
    },
    reviews: {
        type: DataTypes.JSON,
    },
    photos: {
        type: DataTypes.JSON,
    },
    popularDishes: {
        type: DataTypes.JSON,
    },
    features: {
        type: DataTypes.JSON,
    },
    vendorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    timestamps: true,
});

module.exports = Restaurant;