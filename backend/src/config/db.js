const mongoose = require('mongoose');

/**
 * Connects to the MongoDB database using the provided URI.
 * Logs success or failure.
 * @param {string} uri - MongoDB connection string
 */
async function connectDB(uri) {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

module.exports = { connectDB };