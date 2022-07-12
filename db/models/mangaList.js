import mongoose from "mongoose";

const mangaEntrySchema = new mongoose.Schema({
  mal_id: {
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
    default: "Reading",
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
      if (value < 1) throw new Error("Volumes number must be greater than 1");
    },
  },

  progress: {
    type: Number,
    default: 1,
    validate(value) {
      if (value < 1 || value > this.volumes)
        throw new Error(`Progress must be between 1 and ${this.volumes}`);
    },
  },
});

const mangaListSchema = new mongoose.Schema({
  list: [mangaEntrySchema],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
});

mangaEntrySchema.pre("save", async function (next) {
  const mangaListEntry = this;

  if (mangaListEntry.isModified("progress")) {
    if (mangaListEntry.progress === mangaListEntry.volumes)
      mangaListEntry.status = "Completed";
  }
  if (mangaListEntry.isModified("status")) {
    if (mangaListEntry.status === "Completed")
      mangaListEntry.progress = mangaListEntry.volumes;
  }
  next();
});

export const MangaList = mongoose.model("mangalists", mangaListSchema);
