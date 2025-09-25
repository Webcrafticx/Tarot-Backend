const express = require('express')
require('dotenv').config()
const colors = require('colors')
const connectDb = require('./config/dataBase')
const securityMiddleware = require('./middleware/security')
const authRoutes = require('./routes/authRoutes')
const appointmentRoutes = require('./routes/appoinment')
const availabilityRoutes = require('./routes/availabilty')
const paymentRoutes = require('./routes/payment')
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { loadAdminCache } = require('./controllers/authController')



const app = express()
connectDb()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
securityMiddleware(app)
loadAdminCache()
app.use('/api/auth', authRoutes)
app.use('/api/appointment', appointmentRoutes)
app.use('/api/availability', availabilityRoutes)
app.use('/api/payment', paymentRoutes)



app.get('/', (req,res)=>{
    res.status(200).json({
        success: true,
        message: "Tarot Api running successfully",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    })
})

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Appointment System API',
      version: '1.0.0',
      description: 'API documentation for the simple appointment booking system',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

console.log('Swagger docs available at http://localhost:3000/api-docs');

app.use((error, req, res, next) => {
  console.error('🔥 Error:'.red, error);
  
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

const port = process.env.PORT || 3000

app.listen(port, ()=> {
  console.log(`Server running on port ${port}`.green.bold);
})
