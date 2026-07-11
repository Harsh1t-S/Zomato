require('dotenv').config();
const cors = require('cors');
const express = require('express');
const db = require('./Config/db');

const UserRoutes = require('./Routes/UserRoutes');
const OrderRoutes = require('./Routes/OrderRoutes');
const RestrauntRoutes = require('./Routes/RestrauntRoutes');
const FoodRoutes = require('./Routes/FoodRoutes');
const VendorRoutes = require('./Routes/VendorRoutes');
const AdminRoutes = require('./Routes/AdminRoutes');
const PaymentRoutes = require('./Routes/PaymentRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use('/api/users', UserRoutes);
app.use('/api/orders/', OrderRoutes);
app.use('/api/restraunt/', RestrauntRoutes);
app.use('/api/food', FoodRoutes);
app.use('/api/vendors', VendorRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/payments', PaymentRoutes);

app.get('/', (req, res) => {
    res.send('Server is running and database is connected.');
});

db.authenticate()
    .then(() => {
        console.log('Database connected...');
        // { alter: true } makes Sequelize diff each model against the live table
        // and add/modify columns to match (e.g. `vendorId` on restaurants,
        // `isFlagged` on food) instead of silently no-op'ing on tables that
        // already exist. Without this, new columns added to a model never
        // reach an already-deployed database and every query touching them
        // fails with "Unknown column '...' in field list".
        return db.sync({ alter: true });
    })
    .then(() => {
        console.log('Database synchronized.');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect or sync database:', err);
    });
