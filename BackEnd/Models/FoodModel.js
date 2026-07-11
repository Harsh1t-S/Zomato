const db = require('../Config/db');
const { DataTypes } = require('sequelize');

const Food = db.define('Food', {
    // Restaurant IDs are app-generated strings (e.g. `v42-1712345678901`,
    // see VendorSetup.tsx), matching restaurants.id (DataTypes.STRING) —
    // this must match, not INTEGER, or MySQL rejects the insert with a type
    // error on every non-numeric restaurant id (surfaced to vendors as the
    // generic "Failed to add food item").
    restrauntId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    veg: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    isFlagged: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },

});

module.exports = Food;