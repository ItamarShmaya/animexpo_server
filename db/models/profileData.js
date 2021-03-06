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
      immutable: true,
    },

    reviewsCount: {
      type: Number,
      default: 0,
    },

    avatar: {
      secure_url: {
        type: String,
        trim: true,
        default:
          "https://res.cloudinary.com/dhzbwclpj/image/upload/v1657265186/avatars/defualtAvatar_lmkkak.png",
      },

      public_id: {
        type: String,
        trim: true,
        default: "defualtAvatar_lmkkak",
      },
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
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

profileDataSchema.virtual("friendsList", {
  ref: "friendslists",
  localField: "_id",
  foreignField: "profile",
  justOne: true,
});

profileDataSchema.set("toObject", { virtuals: true });
profileDataSchema.set("toJSON", { virtuals: true });

export const ProfileData = mongoose.model("profiledatas", profileDataSchema);
