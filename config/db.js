const mongoose = require("mongoose");


const connectDB = async () => {
  
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 30000,
    maxIdleTimeMS: 30000,
    connectTimeoutMS: 30000, 
  });
  console.log(
    `MongoDB connected URI: ${conn.connection.host}`.cyan
  );

  
};

module.exports = connectDB;
