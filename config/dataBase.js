const mongoose = require('mongoose')
const colors = require('colors')
const { loadAvailabilityCache } = require('../controllers/availability')


const connectDb = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI,{
        })
        await loadAvailabilityCache()
        console.log("Database connected successfully!".blue.bold)

    } catch(error){
        console.log(error)
        process.exit(1)
    }
}


module.exports = connectDb