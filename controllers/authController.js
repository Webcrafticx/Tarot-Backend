const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try{
        const {name, email, password} = req.body;
        const admin = await Admin.findOne({email})
        if(admin){
            return res.status(400).json({
                success: false,
                message: 'Admin already exists'
            })
        }
        const newAdmin = await Admin.create({name,email,password});
        res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            admin: {
                id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
                role: newAdmin.role
            }
        })
    } catch(error){
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        })
    }
}


exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;
        const admin = await Admin.findOne({email})
        if(!admin){
            return res.status(400).json({
                success: false,
                message: 'User with this email does not exist'
            })
        }
        const isMatch = await admin.comparePassword(password)
        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        const token = jwt.sign(
            {id:admin._id, username: admin.name, email: admin.email, role: admin.role},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN}
        )
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        })
    } catch(error){
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        })
    }
}

exports.getprofile = async (req, res) => {
    try{
        res.status(200).json({
            success: true,
            admin: {
                id: req.admin._id,
                name: req.admin.name,
                email: req.admin.email,
                role: req.admin.role
            }
        })
    } catch(error){
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        })
    }
}