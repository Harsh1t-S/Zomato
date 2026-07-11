const Vendor = require('../Models/VendorModel');

const RegisterVendor = async (req, res) => {
    try {
        const { ownerName, number, password, businessName, gstNumber } = req.body;

        if (!ownerName || !number || !password || !businessName) {
            return res.status(400).json({ error: 'Owner name, business name, phone number, and password are required.' });
        }

        if (number.length < 10) {
            return res.status(400).json({ error: 'Please enter a valid phone number.' });
        }

        const existingVendor = await Vendor.findOne({ where: { number: number } });
        if (existingVendor) {
            return res.status(400).json({ error: 'A business account with this phone number already exists.' });
        }
        
        const vendor = await Vendor.create({ 
            ownerName, 
            number, 
            password, 
            businessName, 
            gstNumber: gstNumber || null 
        });
        
        const vendorResponse = vendor.toJSON();
        delete vendorResponse.password;

        res.status(201).json(vendorResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const LoginVendor = async (req, res) => {
    try {
        const { number, password } = req.body;

        if (!number || !password) {
            return res.status(400).json({ error: 'Phone number and password are required.' });
        }

        const vendor = await Vendor.findOne({ where: { number } });
        
        if (!vendor) {
            return res.status(404).json({ error: 'No business account found with this number.' });
        }
        
        const isMatch = (vendor.password === password); 
        
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        
        const vendorResponse = vendor.toJSON();
        delete vendorResponse.password;

        res.json({ ...vendorResponse, role: 'vendor' });
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