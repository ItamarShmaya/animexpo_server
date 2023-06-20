import mongoose from "mongoose";

const mangaEntrySchema = new mongoose.Schema({
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

const favMangaSchema = new mongoose.Schema({
  list: [mangaEntrySchema],

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

export const FavMangaList = mongoose.model("favmangalists", favMangaSchema);
