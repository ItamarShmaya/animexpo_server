import mongoose from "mongoose";

const animeEntrySchema = new mongoose.Schema({
  id: {
    type: Number,
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

const favAnimeSchema = new mongoose.Schema({
  list: [animeEntrySchema],

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

export const FavAnimeList = mongoose.model("favanimelists", favAnimeSchema);
