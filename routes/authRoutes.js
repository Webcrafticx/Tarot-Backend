const express = require('express');
const {register, login, getprofile} = require('../controllers/authController');
const  auth  = require('../middleware/auth');
const { validateLogin } = require('../validators/validation');
const router = express.Router();

router.post('/register', register)
router.post('/login', validateLogin, login)
router.get('/getme', auth, getprofile)


module.exports = router;