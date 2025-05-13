import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoDbConfig from "./configs/mongoDBConnect";
import districtSchema from "./models/DistrictSchema";
import { Request, Response, NextFunction } from "express";
import handleAsync from "./utils/handleAsync";

const app = express();
//const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";

mongoDbConfig();
dotenv.config();

app.use(cors());
app.use(express.json());

app.post(
  "/hpat/registerDistricts",
  handleAsync(async (req: Request, res: Response) => {
    console.log("Received request to register district:", req.body);
    const { districtName, state, country } = req.body;

    try {
      const district = new districtSchema({
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
      const district = await districtSchema.findById(districtId);
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
      const allDistricts = await districtSchema.find();
      res.status(200).json(allDistricts);
    } catch (error) {
      res
        .status(500)
        .json({ message: "An error occurred while fetching districts" });
    }
  })
);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.listen(() => {
  console.log("Server is running on port 5000");
});
