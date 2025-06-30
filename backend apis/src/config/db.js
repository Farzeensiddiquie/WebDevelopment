const mongoose = require('mongoose');

async function connection() {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); 
        
    }
  
}

module.exports = connection;