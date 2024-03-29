import mongoose from "mongoose";

const characterEntrySchema = new mongoose.Schema({
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

const favCharsSchema = new mongoose.Schema({
  list: [characterEntrySchema],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    required: true,
    ref: "users",
  },

  profile: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    required: true,
    ref: "profiledatas",
  },
});

export const FavCharsList = mongoose.model("favcharslists", favCharsSchema);
