import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import mongoose from "mongoose";

const connectdb = async () => {
  try {
    // Is line ko badal kar aise kar do:
await mongoose.connect(`${process.env.MONGODB_URI}/Prescripto`);
    console.log("Database Connected");
  } catch (error) {
    console.log("Database Connection Failed");
    console.log(error);
  }
};

export default connectdb;