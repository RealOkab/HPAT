import mongoose from "mongoose";

const Schema = mongoose.Schema;

const JingleSchema = new Schema({
  filename: {
    type: String,
    required: true,
    unique: true,
  },

  uploadDate: {
    type: Date,
    default: Date.now,
  },
  district: {
    type: Schema.Types.ObjectId,
    ref: "District",
  },
});

export default mongoose.model("Jingle", JingleSchema);
