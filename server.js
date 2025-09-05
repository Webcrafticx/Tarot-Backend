const express = require('express')
require('dotenv').config()
const colors = require('colors')
const connectDb = require('./config/dataBase')
const securityMiddleware = require('./middleware/security')
const authRoutes = require('./routes/authRoutes')



const app = express()
connectDb()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
securityMiddleware(app)

app.use('/api/auth', authRoutes)



app.get('/', (req,res)=>{
    res.status(200).json({
        success: true,
        message: "Tarot Api running successfully",
        timestamp : Date.now().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    })
})

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
