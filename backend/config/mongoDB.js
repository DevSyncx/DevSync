import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database connected");
    });

    mongoose.connect(`${process.env.MONGODB_URI}/gssoc`);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
