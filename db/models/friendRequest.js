import mongoose from "mongoose";
import { FriendsList } from "./friendsList.js";
import { Notification } from "./notifications.js";

const friendRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },

    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },

    status: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

friendRequestSchema.pre("save", async function (next) {
  const friendRequest = this;
  if (friendRequest.status === 1) {
    const notif = new Notification({
      requester: friendRequest.requester,
      recipient: friendRequest.recipient,
      type: 1,
    });
    await notif.save();
  } else if (friendRequest.status === 2) {
    const requesterFriendsList = await FriendsList.findOne({
      owner: friendRequest.requester,
    });

    requesterFriendsList.list.push(friendRequest.recipient);
    await requesterFriendsList.save();

    const recipientFriendsList = await FriendsList.findOne({
      owner: friendRequest.recipient,
    });

    recipientFriendsList.list.push(friendRequest.requester);
    await recipientFriendsList.save();

    const notif = new Notification({
      requester: friendRequest.recipient,
      recipient: friendRequest.requester,
      type: 2,
    });
    await notif.save();
  } else if (friendRequest.status === 3) {
    const notif = new Notification({
      requester: friendRequest.recipient,
      recipient: friendRequest.requester,
      type: 3,
    });
    await notif.save();
  }

  next();
});

export const FriendsRequest = mongoose.model(
  "friendsrequests",
  friendRequestSchema
);
