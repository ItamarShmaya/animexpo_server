import { AnimeList } from "../../../db/models/animeList.js";
import { FavCharsList } from "../../../db/models/favoriteCharacters.js";
import { FavPeopleList } from "../../../db/models/favoritePeople.js";
import { MangaList } from "../../../db/models/mangaList.js";
import { ProfileData } from "../../../db/models/profileData.js";
import { User } from "../../../db/models/user.js";
import { errorCode, errorMessage } from "../../errors/error.js";
import jwt from "jsonwebtoken";
import { TOKEN_USER_SECRET } from "../../../config/env_var.js";

export const createUser = async (req, res) => {
  const { username, password, email, birthday } = req.body;
  try {
    const user = new User({ username, password, email });
    const createdUser = await user.save();
    const animeList = new AnimeList({ owner: createdUser._id });
    await animeList.save();
    const mangaList = new MangaList({ owner: createdUser._id });
    await mangaList.save();
    const profileData = new ProfileData({
      owner: createdUser._id,
      "personalInfo.joined": createdUser.createdAt,
      "personalInfo.birthday": birthday,
    });
    await profileData.save();
    const favCharsList = new FavCharsList({ profile: profileData._id });
    await favCharsList.save();
    const favPeopleList = new FavPeopleList({ profile: profileData._id });
    await favPeopleList.save();
    const token = await createdUser.generateAuthToken();
    await createdUser.populate("animeList mangaList");
    await createdUser.populate({
      path: "profileData",
      populate: { path: "favoriteCharacters favoritePeople" },
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
    res.send("createUser, new error need to handle");
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findByCredentials(username, password);
    const token = await user.generateAuthToken();
    await user.populate("animeList mangaList");
    await user.populate({
      path: "profileData",
      populate: { path: "favoriteCharacters favoritePeople" },
    });
    res.send({ user, token });
  } catch (e) {
    if (e.message === errorMessage.INCORRECT_CREDENTIALS)
      res.status(400).send(errorCode.INCORRECT_CREDENTIALS);
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
    await profileData.populate("favoriteCharacters favoritePeople");
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

export const getUserAnimeList = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) throw new Error(errorMessage.USER_NOT_FOUND);
    const animeList = await AnimeList.findOne({ owner: user._id });
    console.log(animeList);
    res.send(animeList);
  } catch (e) {
    if (e.message === errorMessage.USER_NOT_FOUND) {
      res.status(404).send(errorCode.USER_NOT_FOUND);
    }
  }
};

export const addToAnimeList = async (req, res) => {
  try {
    const animeList = await AnimeList.findOne({ owner: req.user._id });
    const dupe = animeList.list.find(
      (anime) => anime.mal_id === req.body.mal_id
    );
    if (dupe) throw new Error(errorMessage.ANIME_DUPE);
    animeList.list.push(req.body);
    const updatedAnimeList = await animeList.save();
    res.send(updatedAnimeList);
  } catch (e) {
    if (e.message === errorMessage.ANIME_DUPE)
      return res.status(404).send(errorCode.ANIME_DUPE);

    console.log("error", e);
    res.send("error", e);
  }
};

export const removeFromAnimeList = async (req, res) => {
  const { mal_id } = req.body;
  try {
    const animeList = await AnimeList.findOneAndUpdate(
      { owner: req.user._id },
      { $pull: { list: { mal_id } } },
      { new: true }
    );
    res.send(animeList);
  } catch (e) {
    console.log(e);
  }
};

export const updateAnimeEntry = async (req, res) => {
  try {
    const animeList = await AnimeList.findOne({ owner: req.user._id });
    const animeEntry = animeList.list.id(req.body._id);
    animeEntry.set(req.body);
    const updatedList = await animeList.save();
    res.send(updatedList);
  } catch (e) {
    console.log(e);
  }
};

export const getUserMangaList = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) throw new Error(errorMessage.USER_NOT_FOUND);
    const mangalist = await MangaList.findOne({ owner: user._id });
    res.send(mangalist);
  } catch (e) {
    if (e.message === errorMessage.USER_NOT_FOUND) {
      res.status(404).send(errorCode.USER_NOT_FOUND);
    }
  }
};

export const addToMangaList = async (req, res) => {
  try {
    const mangalist = await MangaList.findOne({ owner: req.user._id });
    const dupe = mangalist.list.find(
      (manga) => manga.mal_id === req.body.mal_id
    );
    if (dupe) throw new Error(errorMessage.MANGA_DUPE);
    mangalist.list.push(req.body);
    const updatedMangaList = await mangalist.save();
    res.send(updatedMangaList);
  } catch (e) {
    if (e.message === errorMessage.MANGA_DUPE)
      return res.status(404).send(errorCode.MANGA_DUPE);

    console.log("error", e);
    res.send("error", e);
  }
};

export const removeFromMangaList = async (req, res) => {
  const { mal_id } = req.body;
  try {
    const mangaList = await MangaList.findOneAndUpdate(
      { owner: req.user._id },
      { $pull: { list: { mal_id } } },
      { new: true }
    );
    res.send(mangaList);
  } catch (e) {
    console.log(e);
  }
};

export const updateMangaEntry = async (req, res) => {
  try {
    const mangaList = await MangaList.findOne({ owner: req.user._id });
    const mangaEntry = mangaList.list.id(req.body._id);
    mangaEntry.set(req.body);
    const updatedMangaList = await mangaList.save();
    res.send(updatedMangaList);
  } catch (e) {
    console.log(e);
  }
};

export const getUsersBySearch = async (req, res) => {
  const { username } = req.query;
  try {
    const users = await User.find({ username: new RegExp(username, "i") });
    res.send(users);
  } catch (e) {
    console.log(e);
  }
};
