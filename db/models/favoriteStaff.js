import mongoose from "mongoose";

const staffEntrySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    trim: true,
  },

  name: {
    type: String,
    required: true,
    trim: true,
  },

  image: {
    type: String,
    required: true,
    trim: true,
  },
});

const favStaffSchema = new mongoose.Schema({
  list: [staffEntrySchema],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    required: true,
    ref: "users",
  },

  profile: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "profiledatas",
  },
});

export const FavStaffList = mongoose.model("favStafflists", favStaffSchema);
