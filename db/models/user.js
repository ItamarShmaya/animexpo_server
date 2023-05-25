import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { errorMessage } from "../../app/errors/error.js";
import { TOKEN_USER_SECRET } from "../../config/env_var.js";
import { AnimeList } from "./animeList.js";
import { MangaList } from "./mangaList.js";
import { FavCharsList } from "./favoriteCharacters.js";
import { FavPeopleList } from "./favoritePeople.js";
import { FriendsList } from "./friendsList.js";
import { OnlineUser } from "./onlineUsers.js";
import { Review } from "./reviews.js";
import { ProfileData } from "./profileData.js";
import { Notification } from "./notifications.js";
import { FriendsRequest } from "./friendRequest.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value))
          throw new Error(errorMessage.INVALID_EMAIL);
      },
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

    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },

  { timestamps: true }
);

userSchema.virtual("animeList", {
  ref: "animelists",
  localField: "_id",
  foreignField: "owner",
  justOne: true,
});

userSchema.virtual("mangaList", {
  ref: "mangalists",
  localField: "_id",
  foreignField: "owner",
  justOne: true,
});

userSchema.virtual("reviewsList", {
  ref: "reviews",
  localField: "_id",
  foreignField: "author",
});

userSchema.virtual("profileData", {
  ref: "profiledatas",
  localField: "_id",
  foreignField: "owner",
  justOne: true,
});

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, TOKEN_USER_SECRET);
  user.tokens.push({ token });
  await user.save();
  return token;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const user = this;
    const userId = user._id;
    const userIdString = userId.toString();
    await AnimeList.deleteOne({ owner: userId });
    await MangaList.deleteOne({ owner: userId });
    await FavCharsList.deleteOne({ owner: userId });
    await FavPeopleList.deleteOne({ owner: userId });
    await FriendsList.deleteOne({ owner: userId });
    await FriendsList.updateMany(
      { list: userIdString },
      { $pull: { list: userIdString } }
    );
    await OnlineUser.deleteOne({ username: user.username });
    await ProfileData.deleteOne({ owner: userId });
    await Review.deleteMany({ author: userId });
    await Notification.deleteMany().or([
      { recipient: userId },
      { requester: userId },
    ]);
    await FriendsRequest.deleteMany().or([
      { recipient: userId },
      { requester: userId },
    ]);

    next();
  }
);

userSchema.statics.findByCredentials = async function (username, password) {
  const user = await User.findOne({ username });
  if (!user) throw new Error(errorMessage.INCORRECT_CREDENTIALS);
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error(errorMessage.INCORRECT_CREDENTIALS);
  return user;
};

export const User = mongoose.model("users", userSchema);
