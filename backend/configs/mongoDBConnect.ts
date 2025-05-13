import mongoose from "mongoose";

const mongoDbConfig = () => {
  const dataBaseString = "mongodb://172.20.144.1:27017/HPAT-DB";
  mongoose
    .connect(dataBaseString, { connectTimeoutMS: 5000 })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log("Error connecting to MongoDB", err);
    });
};

export default mongoDbConfig;
