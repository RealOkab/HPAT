import mongoose from "mongoose";

const Schema = mongoose.Schema;

const InformationCenterSchema = new Schema({
  informationCenterName: {
    type: String,
    required: true,
  },
  gpsLocation: {
    type: String,
    required: true,
  },
  subDistrict: {
    type: String,
    required: true,
  },
  gpsLocationAccuracy: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  operatorsContact: {
    type: String,
  },

  jinglePlayer: [
    {
      type: Schema.Types.ObjectId,
      ref: "JinglePlayer",
    },
  ],
});

export default mongoose.model("InformationCenter", InformationCenterSchema);
