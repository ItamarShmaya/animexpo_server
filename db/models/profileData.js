import mongoose from "mongoose";

const profileDataSchema = new mongoose.Schema({
  personalInfo: {
    gender: {
      type: String,
      trim: true,
    },

    birthday: {
      type: Date,
      trim: true,
    },

    joined: {
      type: Date,
      trim: true,
      required: true,
    },

    avatar: {
      type: Buffer,
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

profileDataSchema.virtual("favoriteCharacters", {
  ref: "favcharslists",
  localField: "_id",
  foreignField: "profile",
  justOne: true,
});

profileDataSchema.virtual("favoritePeople", {
  ref: "favpeoplelists",
  localField: "_id",
  foreignField: "profile",
  justOne: true,
});

profileDataSchema.set("toObject", { virtuals: true });
profileDataSchema.set("toJSON", { virtuals: true });

export const ProfileData = mongoose.model("profiledatas", profileDataSchema);
