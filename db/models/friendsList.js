import mongoose from "mongoose";

const friendsListSchema = new mongoose.Schema({
  list: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "users",
    },
  ],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    required: true,
    ref: "users",
  },

  profile: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "profiledatas",
  },
});

export const FriendsList = mongoose.model("friendslists", friendsListSchema);
