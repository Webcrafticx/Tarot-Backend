const joi = require('joi');

const appointmentSchema = joi.object({
    name: joi.string().trim().min(2).max(50).required()
    .messages({
        'string empty': 'Name is required',
        'string.min': 'Name should be at least 2 characters',
        'string.max': 'Name should be at most 50 characters',
    }),
    email: joi.string().email().required()
    .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email address',
    }),
    phone: joi.string().pattern(/^[0-9]{10,12}$/).required()
    .messages({
        'string.empty': 'Phone number is required',
        'string.pattern.base': 'Phone number must be 10-12 digits',
    }),
    serviceType: joi.string().trim().required()
    .messages({
        'string.empty': 'Service type is required',
    }),
    selectedWindow: joi.string().valid('Mon-Wed', 'Thu-Fri', 'Sat-Sun').optional()
    .messages({
        'any.only': 'Selected window must be one of Mon-Wed, Thu-Fri, Sat-Sun', 
    }),
    duration: joi.number().integer().min(10).max(120).optional()
    .messages({
        'number.base': 'Duration must be a number',
        'number.min': 'Duration must be at least 10 minutes',
        'number.max': 'Duration must be at most 120 minutes',
    }), 
})

const loginSchema = joi.object({
    email: joi.string().email().required()
    .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email address',
    }),
    password: joi.string().required()
    .messages({
        'string.empty': 'Password is required',
    })
})


const validate = (schema) => (req, res, next) => {
    const {error} = schema.validate(req.body, {abortEarly: false});
    if(error){
        return res.status(400).json({
            success: false,
            message: 'validation failed',
            errors: error.details.map(err => ({
                field: err.path[0],
                message: err.message
            }))
        })
    }
    next();
}

module.exports = {
    validateAppointment: validate(appointmentSchema),
    validateLogin: validate(loginSchema)
}