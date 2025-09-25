const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');

let adminCache = new Map();

exports.loadAdminCache = async () => {
  const admins = await Admin.find().lean();
  admins.forEach(admin => {
    adminCache.set(admin.email, admin);
  });
    console.log('Admin cache loaded:', adminCache);
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (adminCache.has(email)) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists',
      });
    }

    const newAdmin = await Admin.create({ name, email, password });

    adminCache.set(newAdmin.email, newAdmin.toObject());

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let admin = adminCache.get(email);
    console.log('Admin fetched from cache:', adminCache);

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: 'User with this email does not exist',
      });
    }

    const dbAdmin = await Admin.findById(admin._id);
    const isMatch = await dbAdmin.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      {
        id: dbAdmin._id,
        username: dbAdmin.name,
        email: dbAdmin.email,
        role: dbAdmin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

exports.getprofile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      admin: {
        id: req.admin._id,
        name: req.admin.name,
        email: req.admin.email,
        role: req.admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};
