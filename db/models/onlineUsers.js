import mongoose from "mongoose";

const onlineUserSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
  },

  socketId: {
    type: String,
  },
});

export const OnlineUser = mongoose.model("onlineusers", onlineUserSchema);
