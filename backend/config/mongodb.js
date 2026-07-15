import mongoose from "mongoose";

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database Connected");
  } catch (error) {
    console.log("Database Connection Failed");
    console.log(error);
  }
};

export default connectdb;