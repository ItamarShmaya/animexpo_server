import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { errorMessage } from "../../app/errors/error.js";
import { TOKEN_USER_SECRET } from "../../config/env_var.js";

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

userSchema.statics.findByCredentials = async function (username, password) {
  const user = await User.findOne({ username });
  if (!user) throw new Error(errorMessage.INCORRECT_CREDENTIALS);
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error(errorMessage.INCORRECT_CREDENTIALS);
  return user;
};

export const User = mongoose.model("users", userSchema);
