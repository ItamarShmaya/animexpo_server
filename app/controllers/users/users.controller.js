import { AnimeList } from "../../../db/models/animeList.js";
import { FavCharsList } from "../../../db/models/favoriteCharacters.js";
import { FavStaffList } from "../../../db/models/favoriteStaff.js";
import { MangaList } from "../../../db/models/mangaList.js";
import { ProfileData } from "../../../db/models/profileData.js";
import { User } from "../../../db/models/user.js";
import { errorCode, errorMessage } from "../../errors/error.js";
import jwt from "jsonwebtoken";
import { TOKEN_USER_SECRET } from "../../../config/env_var.js";
import { FriendsList } from "../../../db/models/friendsList.js";
import {
  defualtAvatarPublicId,
  deleteImage,
} from "../../../config/cloudinaryConfig.js";

export const createUser = async (req, res) => {
  const { username, password, email, birthday } = req.body;
  try {
    const user = new User({
      username: username.toLowerCase(),
      password,
      email,
    });
    const createdUser = await user.save();
    const animeList = new AnimeList({ owner: createdUser._id });
    await animeList.save();
    const mangaList = new MangaList({ owner: createdUser._id });
    await mangaList.save();
    const profileData = new ProfileData({
      owner: createdUser._id,
      "personalInfo.displayName": username,
      "personalInfo.joined": createdUser.createdAt,
      "personalInfo.birthday": birthday,
    });
    await profileData.save();
    const favCharsList = new FavCharsList({
      owner: createdUser._id,
      profile: profileData._id,
    });
    await favCharsList.save();
    const favStaffList = new FavStaffList({
      owner: createdUser._id,
      profile: profileData._id,
    });
    await favStaffList.save();
    const friendsList = new FriendsList({
      owner: createdUser._id,
      profile: profileData._id,
    });
    await friendsList.save();
    const token = await createdUser.generateAuthToken();
    await createdUser.populate("animeList mangaList");
    await createdUser.populate({
      path: "profileData",
      populate: {
        path: "favoriteCharacters favoriteStaff friendsList",
        populate: {
          path: "list",
          options: {
            sort: { createdAt: "desc" },
          },
        },
      },
    });
    res.status(201).send({ user: createdUser, token });
  } catch (e) {
    if (e.code === 11000) {
      if (e.keyValue.username) {
        return res.status(400).send(errorCode.USERNAME_TAKEN);
      }
      if (e.keyValue.email) {
        return res.status(400).send(errorCode.EMAIL_TAKEN);
      }
    }
    if (e.errors?.email?.message.toLowerCase() === errorMessage.INVALID_EMAIL) {
      return res.status(400).send(errorCode.INVALID_EMAIL);
    }
    console.log(e);
    res.status(400).send(e);
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findByCredentials(username.toLowerCase(), password);
    const token = await user.generateAuthToken();
    await user.populate("animeList mangaList");
    await user.populate({
      path: "profileData",
      populate: {
        path: "favoriteCharacters favoriteStaff friendsList",
        populate: {
          path: "list",
          options: {
            sort: { createdAt: "desc" },
          },
        },
      },
    });
    res.send({ user, token });
  } catch (e) {
    if (e.message === errorMessage.INCORRECT_CREDENTIALS)
      res.status(400).send(errorCode.INCORRECT_CREDENTIALS);
    console.log(e);
  }
};

export const logoutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
};

export const getUserProfileData = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) throw new Error(errorMessage.USER_NOT_FOUND);
    const profileData = await ProfileData.findOne({ owner: user._id });
    await profileData.populate({
      path: "favoriteCharacters favoriteStaff friendsList",
      populate: {
        path: "list",
        options: {
          sort: { createdAt: "desc" },
        },
      },
    });
    res.send(profileData);
  } catch (e) {
    res.status(404).send(errorCode.USER_NOT_FOUND);
  }
};

export const authenticateUser = async (req, res) => {
  const { token, username } = req.body;
  try {
    const decoded = jwt.verify(token, TOKEN_USER_SECRET);
    const user = await User.findOne({ _id: decoded._id, username });
    if (!user) throw new Error();
    res.send({ auth: true });
  } catch (e) {
    res.status(401).send({ auth: false });
  }
};

export const getUsersBySearch = async (req, res) => {
  const { username } = req.query;
  try {
    const users = await User.find({
      username: new RegExp(username, "i"),
    }).populate("profileData");
    res.send(users);
  } catch (e) {
    console.log(e);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const deletedUser = await user.deleteOne();
    const imageToDelete = deletedUser.avatar.public_id;
    if (imageToDelete !== defualtAvatarPublicId) {
      const deleteResponse = await deleteImage(imageToDelete);
      if (deleteResponse.error) throw new Error();
    }
    res.send({ delete: "success", code: 200 });
  } catch (e) {
    console.log(e);
  }
};
