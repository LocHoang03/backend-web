const mongoose = require('mongoose');
require('dotenv').config();

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.log('MongoDB failed to connect: ' + error.message);
  }
}

module.exports = connectDb;
