import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import mongoose from "mongoose";
import { GridFSBucket, MongoClient } from "mongodb";
import { Readable } from "stream";
import mongoDbConfig from "./configs/mongoDBConnect";

import DistrictSchema from "./models/DistrictSchema";
import { Request, Response, NextFunction } from "express";
import handleAsync from "./utils/handleAsync";
import InformationCenter from "./models/InformationCenterSchema";
import Jingle from "./models/Jingles";

const port = process.env.PORT || 5000;
const app = express();
//const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";

mongoDbConfig();
dotenv.config();

let bucket: GridFSBucket;

const storage = multer.memoryStorage(); // Store files in memory as buffers
const upload = multer({ storage });

app.use(cors());
app.use(express.json());

type district = {
  districtName: string;
  state: string;
  country: string;
  informmationCenters?: unknown[];
};
app.post(
  "/hpat/registerDistricts",
  handleAsync(async (req: Request, res: Response) => {
    console.log("Received request to register district:", req.body);
    const { districtName, state, country } = req.body;

    try {
      const district = new DistrictSchema({
        districtName: districtName,
        state: state,
        country: country,
      });
      await district.save();
      res
        .status(200)
        .json({ message: "District registered successfully", district });
    } catch (error) {
      console.log("Error registering district:", error);
      res
        .status(500)
        .json({ message: "An error occurred while registering the district" });
    }
  })
);

app.get(
  "/hpat/registeredDistrict/:districtId",
  handleAsync(async (req: Request, res: Response) => {
    const { districtId } = req.params;
    try {
      const district = await DistrictSchema.findById(districtId);
      if (!district) {
        return res.status(404).json({ message: "District not found" });
      }
      res.status(200).json(district);
    } catch (error) {
      res
        .status(500)
        .json({ message: "An error occurred while fetching the district" });
    }
  })
);
// get all registered districts
app.get(
  "/hpat/registerDistricts/viewAll",
  handleAsync(async (req: Request, res: Response) => {
    try {
      const allDistricts = await DistrictSchema.find();
      res.status(200).json(allDistricts);
    } catch (error) {
      res
        .status(500)
        .json({ message: "An error occurred while fetching districts" });
    }
  })
);

// Registration of cics starts here.
app.post(
  "/hpat/registeredDistrict/:districtId/registerCiC",
  handleAsync(async (req, res) => {
    try {
      const { districtId } = req.params;
      const {
        informationCenterName,
        gpsLocation,
        subDistrict,
        description,
        gpsLocationAccuracy,
      } = req.body;

      console.log("Received request for district:", districtId);
      console.log("Request body:", req.body);

      // ✅ Check if district exists
      const district = await DistrictSchema.findById(districtId);
      if (!district) {
        return res.status(404).json({ message: "District not found" });
      }

      const newCiC = new InformationCenter({
        informationCenterName,
        gpsLocation,
        subDistrict,
        description,
        gpsLocationAccuracy,
      });
      await newCiC.save();

      district.informationCenters.push(newCiC._id);
      await district.save();

      console.log("New Information Center registered:", newCiC);

      res.status(201).json({
        newCiC,
        message: "Information center registered successfully",
        district,
      });
    } catch (error) {
      console.error("Error during registration:", error);
      res
        .status(500)
        .json({ message: "An error occurred during registration" });
    }
  })
);

app.get(
  "/hpat/registeredDistrict/:districtId/registeredCiC",
  handleAsync(async (req: Request, res: Response) => {
    const { districtId, informationCenterId } = req.params;

    try {
      const district = await DistrictSchema.findById(districtId).populate({
        path: "informationCenters",
        match: { _id: informationCenterId },
      });

      if (!district) {
        return res.status(404).json({ message: "District not found" });
      }

      res.status(200).json(district);
    } catch (error) {
      console.error("Error fetching Information Center:", error);
      res.status(500).json({
        message: "An error occurred while fetching the Information Center",
      });
    }
  })
);

app.get(
  "/hpat/registeredDistrict/:districtId/registeredCiC/:cicId",
  handleAsync(async (req: Request, res: Response) => {
    const { districtId, cicId } = req.params;

    try {
      const district = await DistrictSchema.findById(districtId).populate({
        path: "informationCenters",
        match: { _id: cicId },
      });

      if (!district) {
        return res.status(404).json({ message: "District not found" });
      }

      const cic = district.informationCenters.find(
        (cic) => cic._id.toString() === cicId
      );
      if (!cic) {
        return res
          .status(404)
          .json({ message: "Information Center not found" });
      }
      console.log("Fetched Information Center:", cic);
      // Return the specific Information Center
      res.status(200).json(cic);
    } catch (error) {
      console.error("Error fetching Information Center:", error);
      res.status(500).json({
        message: "An error occurred while fetching the Information Center",
      });
    }
  })
);

//routes for jingle uploads
app.post(
  "/hpat/jingles/upload/:districtId",
  upload.single("audio"),
  handleAsync(async (req, res) => {
    console.log("Received request to upload jingle");
    if (!req.file) {
      //console.log("No file uploaded");
      return res.status(400).send("No file uploaded");
    }
    const { districtId } = req.params;
    //console.log("District ID:", districtId);

    const district = await DistrictSchema.findById(districtId);
    if (!district) {
      // console.log("District not found for ID:", districtId);
      return res.status(404).json({ message: "District not found" });
    }

    // Initialize GridFSBucket if not already initialized
    if (!bucket) {
      // @ts-ignore
      bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads",
      });
      //console.log("Initialized GridFSBucket");
    }

    const readableStream = Readable.from(req.file.buffer);
    //console.log("Created readable stream from file buffer");

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });
    //console.log("Opened upload stream for file:", req.file.originalname);

    readableStream.pipe(uploadStream);

    uploadStream
      .on("error", (err) => {
        // console.error("Error uploading file to GridFS:", err);
        res.status(500).send(err.message);
      })
      .on("finish", async () => {
        console.log("File uploaded to GridFS with ID:", uploadStream.id);
        const newJingle = new Jingle({
          filename: req.file?.originalname,
          district: districtId,
        });
        await newJingle.save();
        //console.log("Jingle document saved to DB:", newJingle);
        res.status(201).send({
          fileId: uploadStream.id,
          message: "Jingle uploaded and saved successfully",
        });
      });
  })
);

// Endpoint to fetch jingles for a specific district
app.get(
  "/hpat/jingles/:districtId",
  handleAsync(async (req, res) => {
    const { districtId } = req.params;
    try {
      const jingles = await Jingle.find({ district: districtId });
      if (!jingles || jingles.length === 0) {
        return res
          .status(404)
          .json({ message: "No jingles found for this district" });
      }
      res.status(200).json(jingles);
    } catch (error) {
      console.error("Error fetching jingles:", error);
      res
        .status(500)
        .json({ message: "An error occurred while fetching jingles" });
    }
  })
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
