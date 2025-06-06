import mongoose from "mongoose";

const { Schema } = mongoose;
const districtSchema = new Schema({
  districtName: {
    type: String,
    required: true,
    unique: true,
  },
  state: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },
  informationCenters: [
    {
      type: Schema.Types.ObjectId,
      ref: "InformationCenter",
    },
  ],
});

export default mongoose.model("District", districtSchema);
