import mongoose from "mongoose";

const Schema = mongoose.Schema;

const JinglePlayerSchema = new Schema({
  jingleName: {
    type: String,
    required: true,
  },
  timeOfPlay: {
    type: String,
    required: true,
  },
  frequencyOfPlay: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },

  timesPlayed: {
    type: Array,
    required: true,
  },
  informationCenter: {
    type: Schema.Types.ObjectId,
    ref: "InformationCenter",
  },
});

export default mongoose.model("JinglePlayer", JinglePlayerSchema);
