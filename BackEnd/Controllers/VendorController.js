const Vendor = require('../Models/VendorModel');

const RegisterVendor = async (req, res) => {
    try {
        const existingVendor = await Vendor.findOne({ where: { number: req.body.number } });
        if (existingVendor) {
            return res.status(400).json({ error: 'Vendor with this number already exists' });
        }
        
        const { ownerName, number, password, businessName, gstNumber } = req.body;
        const vendor = await Vendor.create({ 
            ownerName, 
            number, 
            password, 
            businessName, 
            gstNumber 
        });
        
        res.status(201).json(vendor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const LoginVendor = async (req, res) => {
    try {
        const { number, password } = req.body;
        const vendor = await Vendor.findOne({ where: { number } });
        
        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }
        
        const isMatch = (vendor.password === password); 
        
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        res.json({ ...vendor.toJSON(), role: 'vendor' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const GetAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.findAll();
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    RegisterVendor,
    LoginVendor,
    GetAllVendors
};