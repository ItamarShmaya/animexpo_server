import express from "express";
import {
  authenticateUser,
  createUser,
  getUserProfileData,
  loginUser,
  logoutUser,
  getUsersBySearch,
  deleteUser,
} from "../../controllers/users/users.controller.js";
import {
  addToMangaList,
  getUserMangaList,
  removeFromMangaList,
  updateMangaEntry,
} from "../../controllers/users/mangaList.controller.js";
import {
  getUserAnimeList,
  addToAnimeList,
  removeFromAnimeList,
  updateAnimeEntry,
} from "../../controllers/users/animeList.controller.js";
import { authUser } from "../../middlewares/authUser.js";
import {
  addToFavCharList,
  removeFromFavCharList,
} from "../../controllers/users/favCharList.controllers.js";
import {
  addToFavPeopleList,
  removeFromFavPeopleList,
} from "../../controllers/users/favPeopleList.controllers.js";
import {
  updateAvatar,
  updateProfileData,
} from "../../controllers/users/profileData.controller.js";
import { multerUpload } from "../../middlewares/multer.js";
import { cloudinaryConfig } from "../../../config/cloudinaryConfig.js";
import {
  addReview,
  getEntryReviews,
  getUserReviews,
} from "../../controllers/users/reviews.controllers.js";
import {
  acceptFriendRequest,
  getUserFriendRequests,
  getUserFriendsList,
  isUserInFriendsList,
  rejectFriendRequest,
  removeFriend,
  sendFriendRequest,
  wasFriendRequestSent,
} from "../../controllers/users/friendsList.controller.js";
import {
  getUserNotifications,
  updateNotificationsToRead,
} from "../../controllers/users/notifications.controller.js";

export const userRouter = express.Router();

userRouter.post("/users/register", createUser);
userRouter.post("/user/login", loginUser);
userRouter.post("/user/logout", authUser, logoutUser);
userRouter.post("/user/authinticate", authUser, authenticateUser);

userRouter.post(
  "/user/:username/changeAvatar",
  authUser,
  cloudinaryConfig,
  multerUpload,
  updateAvatar
);

userRouter.post("/user/reviews", authUser, addReview);

userRouter.post(
  "/user/:username/sendFriendRequest",
  authUser,
  sendFriendRequest
);
userRouter.post(
  "/user/:username/acceptFriendRequest",
  authUser,
  acceptFriendRequest
);
userRouter.post(
  "/user/:username/rejectFriendRequest",
  authUser,
  rejectFriendRequest
);
userRouter.post(
  "/user/:username/isUserInFriendsList",
  authUser,
  isUserInFriendsList
);
userRouter.post(
  "/user/:username/wasFriendRequestSent",
  authUser,
  wasFriendRequestSent
);
userRouter.post("/user/:username/removeFriend", authUser, removeFriend);
userRouter.post(
  "/user/:username/notifications",
  authUser,
  updateNotificationsToRead
);

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

userRouter.patch(
  "/user/:username/addToFavCharList",
  authUser,
  addToFavCharList
);
userRouter.patch(
  "/user/:username/removeFromFavCharList",
  authUser,
  removeFromFavCharList
);

userRouter.patch(
  "/user/:username/addToFavPeopleList",
  authUser,
  addToFavPeopleList
);
userRouter.patch(
  "/user/:username/removeFromFavPeopleList",
  authUser,
  removeFromFavPeopleList
);

userRouter.patch(
  "/user/:username/updateProfileData",
  authUser,
  updateProfileData
);

userRouter.get("/users", getUsersBySearch);
userRouter.get("/user/:username/animelist", getUserAnimeList);
userRouter.get("/user/:username/mangalist", getUserMangaList);
userRouter.get("/reviews/:id", getEntryReviews);
userRouter.get("/user/:username/reviews", getUserReviews);
userRouter.get(
  "/user/:username/friendRequests",
  authUser,
  getUserFriendRequests
);
userRouter.get("/user/:username/notifications", authUser, getUserNotifications);
userRouter.get("/user/:username/friends", authUser, getUserFriendsList);

userRouter.get("/profile/:username", getUserProfileData);

userRouter.delete(
  "/user/:username/deleteUser",
  authUser,
  cloudinaryConfig,
  deleteUser
);
