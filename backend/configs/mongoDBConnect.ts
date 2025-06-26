import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import { GridFSBucket } from "mongodb";
dotenv.config();

let bucket: GridFSBucket;

const mongoDbConfig = async () => {
  const dataBaseString =
    process.env.MONGO_URI || "mongodb://172.20.144.1:27017/HPAT-DB";
  try {
    await mongoose.connect(dataBaseString, { connectTimeoutMS: 5000 });
    console.log("Connected to MongoDB");
    // @ts-ignore
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });
    console.log("GridFSBucket ready");
  } catch (err) {
    console.log("Error connecting to MongoDB", err);
  }
};

export default mongoDbConfig;
