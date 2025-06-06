import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoDbConfig from "./configs/mongoDBConnect";
import DistrictSchema from "./models/DistrictSchema";
import { Request, Response, NextFunction } from "express";
import handleAsync from "./utils/handleAsync";
import InformationCenter from "./models/InformationCenterSchema";
const port = process.env.PORT || 5000;

const app = express();
//const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";

mongoDbConfig();
dotenv.config();

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
  "/hpat/registeredDistrict/:districtId/registeredCiC/:informationCenterId/view",
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

      const informationCenter = district.informationCenters.find(
        (ic) => ic._id.toString() === informationCenterId
      );

      if (!informationCenter) {
        return res.status(404).json({ message: "Information Center not found" });
      }

      res.status(200).json(informationCenter);
    } catch (error) {
      console.error("Error fetching Information Center:", error);
      res
        .status(500)
        .json({ message: "An error occurred while fetching the Information Center" });
    }
  })
);  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
