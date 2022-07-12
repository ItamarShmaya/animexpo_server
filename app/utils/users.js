import { OnlineUser } from "../../db/models/onlineUsers.js";

export const addUser = async (username, socketId) => {
  try {
    const user = new OnlineUser({ username, socketId });
    return await user.save();
  } catch (e) {
    throw e;
  }
};

export const removeUser = async (socketId) => {
  try {
    await OnlineUser.findOneAndDelete({ socketId });
  } catch (e) {
    throw e;
  }
};

export const getUser = async (username) => {
  try {
    const user = await OnlineUser.find({ username });
    return user;
  } catch (e) {
    throw e;
  }
};
