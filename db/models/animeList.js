import mongoose from "mongoose";

const animeEntrySchema = new mongoose.Schema({
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

  episodes: {
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

const animeListSchema = new mongoose.Schema({
  list: [animeEntrySchema],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    required: true,
    ref: "User",
  },
});

export const AnimeList = mongoose.model("animelists", animeListSchema);
