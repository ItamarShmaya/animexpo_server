import express from "express";
import {
  authenticateUser,
  createUser,
  getUserProfileData,
  loginUser,
  logoutUser,
  getUserAnimeList,
  addToAnimeList,
  removeFromAnimeList,
  updateAnimeEntry,
  addToMangaList,
  getUserMangaList,
  removeFromMangaList,
  updateMangaEntry,
  getUsersBySearch,
} from "../../controllers/users/users.controller.js";
import { authUser } from "../../middlewares/authUser.js";

export const userRouter = express.Router();

userRouter.post("/users/register", createUser);

userRouter.post("/user/login", loginUser);
userRouter.post("/user/logout", authUser, logoutUser);
userRouter.post("/user/authinticate", authUser, authenticateUser);

userRouter.patch("/user/:username/addToAnimelist", authUser, addToAnimeList);
userRouter.patch(
  "/user/:username/removeFromAnimelist",
  authUser,
  removeFromAnimeList
);
userRouter.patch(
  "/user/:username/updateAnimeEntry",
  authUser,
  updateAnimeEntry
);

userRouter.patch("/user/:username/addToMangalist", authUser, addToMangaList);
userRouter.patch(
  "/user/:username/removeFromMangalist",
  authUser,
  removeFromMangaList
);
userRouter.patch(
  "/user/:username/updateMangaEntry",
  authUser,
  updateMangaEntry
);

userRouter.get("/users", getUsersBySearch);
userRouter.get("/user/:username/animelist", getUserAnimeList);
userRouter.get("/user/:username/mangalist", getUserMangaList);

userRouter.get("/profile/:username", getUserProfileData);
