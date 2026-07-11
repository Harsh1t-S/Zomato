const Vendor = require('../Models/VendorModel');

const RegisterVendor = async (req, res) => {
    try {
        const { ownerName, number, password, businessName, gstNumber } = req.body;

        // 1. Strict Validation Repercussions: Catch empty fields before hitting the database
        if (!ownerName || !number || !password || !businessName || !gstNumber) {
            return res.status(400).json({ error: 'All fields, including GST and Business Name, are strictly required.' });
        }

        // 2. Format validation (Example: phone number length check)
        if (number.length < 10) {
            return res.status(400).json({ error: 'Please enter a valid phone number.' });
        }

        // 3. Collision Check: Prevent duplicate accounts
        const existingVendor = await Vendor.findOne({ where: { number: number } });
        if (existingVendor) {
            return res.status(400).json({ error: 'A business account with this phone number already exists.' });
        }
        
        // 4. Create the vendor
        const vendor = await Vendor.create({ 
            ownerName, 
            number, 
            password, // NOTE: See Future Security Warning below
            businessName, 
            gstNumber 
        });
        
        // Return without password for security
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
        
        // Future Problem Addressed: Admin Approval Check
        // If you want to require Zomato Admins to manually verify the GST number before they can login:
        /*
        if (vendor.isApproved === false) {
            return res.status(403).json({ error: 'Your account is pending review by our team. We will contact you soon.' });
        }
        */

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