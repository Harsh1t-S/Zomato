const bcrypt = require('bcryptjs');
const Vendor = require('../Models/VendorModel');
const { signToken } = require('../Utils/token');

const SALT_ROUNDS = 10;

const RegisterVendor = async (req, res) => {
    try {
        const { ownerName, number, password, businessName, gstNumber } = req.body;

        if (!ownerName || !number || !password || !businessName) {
            return res.status(400).json({ error: 'Owner name, business name, phone number, and password are required.' });
        }

        if (number.length < 10) {
            return res.status(400).json({ error: 'Please enter a valid phone number.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters.' });
        }

        const existingVendor = await Vendor.findOne({ where: { number } });
        if (existingVendor) {
            return res.status(400).json({ error: 'A business account with this phone number already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const vendor = await Vendor.create({
            ownerName,
            number,
            password: hashedPassword,
            businessName,
            gstNumber: gstNumber || null
        });

        const vendorResponse = vendor.toJSON();
        delete vendorResponse.password;

        const token = signToken({ id: vendor.id, number: vendor.number, role: 'vendor' });

        res.status(201).json({ ...vendorResponse, token, role: 'vendor' });
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

        const looksHashed = typeof vendor.password === 'string' && vendor.password.startsWith('$2');
        const isMatch = looksHashed
            ? await bcrypt.compare(password, vendor.password)
            : vendor.password === password;

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        if (!looksHashed) {
            vendor.password = await bcrypt.hash(password, SALT_ROUNDS);
            await vendor.save();
        }

        const vendorResponse = vendor.toJSON();
        delete vendorResponse.password;

        const token = signToken({ id: vendor.id, number: vendor.number, role: 'vendor' });

        res.json({ ...vendorResponse, token, role: 'vendor' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin-only
const GetAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.findAll({ attributes: { exclude: ['password'] } });
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin-only: approve a vendor so their restaurant can go live
const ApproveVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await Vendor.findByPk(id);
        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }
        await vendor.update({ isApproved: true });
        const vendorResponse = vendor.toJSON();
        delete vendorResponse.password;
        res.json(vendorResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Vendor self-service: update their own account details.
// Changing the business name or GST number re-triggers admin approval,
// since those are the fields customers/admin rely on to verify identity.
// Owner name and password can be changed freely.
const UpdateVendor = async (req, res) => {
    try {
        const { id } = req.params;

        if (String(req.auth.id) !== String(id)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const vendor = await Vendor.findByPk(id);
        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        const { ownerName, businessName, gstNumber, password } = req.body;
        const updates = {};

        if (ownerName !== undefined) updates.ownerName = ownerName;

        const businessNameChanged = businessName !== undefined && businessName !== vendor.businessName;
        const gstChanged = gstNumber !== undefined && gstNumber !== vendor.gstNumber;
        if (businessNameChanged) updates.businessName = businessName;
        if (gstChanged) updates.gstNumber = gstNumber;
        if (businessNameChanged || gstChanged) {
            updates.isApproved = false; // re-review required for identity-relevant changes
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ error: 'Password must be at least 6 characters.' });
            }
            updates.password = await bcrypt.hash(password, SALT_ROUNDS);
        }

        await vendor.update(updates);

        const vendorResponse = vendor.toJSON();
        delete vendorResponse.password;
        res.json({
            ...vendorResponse,
            reapprovalRequired: businessNameChanged || gstChanged,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    RegisterVendor,
    LoginVendor,
    GetAllVendors,
    ApproveVendor,
    UpdateVendor,
};
