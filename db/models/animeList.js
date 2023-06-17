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

  format: {
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
    ref: "users",
  },
});

animeEntrySchema.pre("save", async function (next) {
  const animeListEntry = this;

  if (animeListEntry.isModified("progress")) {
    if (animeListEntry.progress === animeListEntry.episodes)
      animeListEntry.status = "Completed";
  }
  if (animeListEntry.isModified("status")) {
    if (animeListEntry.status === "Completed")
      animeListEntry.progress = animeListEntry.episodes;
  }
  next();
});

export const AnimeList = mongoose.model("animelists", animeListSchema);
