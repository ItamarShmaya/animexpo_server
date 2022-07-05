import mongoose from "mongoose";

const personEntrySchema = new mongoose.Schema({
  mal_id: {
    type: Number,
    required: true,
    trim: true,
  },

  name: {
    type: String,
    required: true,
    trim: true,
  },

  title: {
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

const favPeopleSchema = new mongoose.Schema({
  list: [personEntrySchema],

  profile: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "ProfileData",
  },
});

export const FavPeopleList = mongoose.model("favpeoplelists", favPeopleSchema);
