import mongoose from "mongoose";

const mangaEntrySchema = new mongoose.Schema({
  mal_id: {
    type: Number,
    required: true,
    trim: true,
    unique: true,
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

  type: {
    type: String,
    required: true,
    trim: true,
  },

  comment: {
    type: String,
    trim: true,
  },

  status: {
    type: String,
    trim: true,
    default: "Watching",
  },

  score: {
    type: Number,
    trim: true,
    default: 1,
  },

  volumes: {
    type: Number,
    reuiqred: true,
    validate(value) {
      if (value < 1) throw new Error("Episodes number must be greater than 1");
    },
  },

  progress: {
    type: Number,
    default: 1,
    validate(value) {
      if (value < 1 || value > this.episodes)
        throw new Error(`Progress must be between 1 and ${this.episodes}`);
    },
  },
});

const mangaListSchema = new mongoose.Schema({
  list: [mangaEntrySchema],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

export const MangaList = mongoose.model("mangalists", mangaListSchema);
