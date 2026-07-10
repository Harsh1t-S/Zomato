const cors = require('cors');   
const express = require('express');
const db = require('./Config/db');

const UserRoutes = require('./Routes/UserRoutes');
const OrderRoutes = require('./Routes/OrderRoutes')
const RestrauntRoutes = require('./Routes/RestrauntRoutes')
const FoodRoutes = require('./Routes/FoodRoutes')

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

app.use('/api/users', UserRoutes);
app.use('/api/orders/', OrderRoutes);
app.use('/api/restraunt/', RestrauntRoutes)
app.use('/api/food', FoodRoutes);

app.get('/', (req, res) => {
    res.send('Server is running and database is connected.');
});

db.authenticate()
    .then(() => {
        console.log('Database connected...');
        return db.sync();
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