import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}`
    );
    console.log(
      `MongoDB connected at ⚙ ${connectionInstance.connection.host} `
    );
  } catch (error) {
    console.log(`MongoDB connection Error: ${error}`);
    process.exit(1);
  }
};

export { connectDB };
