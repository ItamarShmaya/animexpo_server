import mongoose from "mongoose";

const types = {
  1: "new friend request",
  2: "accepted friend request",
  3: "rejected friend request",
  4: "removed from friends list",
};
const notificationSchema = new mongoose.Schema(
  {
    read: {
      type: Boolean,
      default: false,
    },

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

    type: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// notificationSchema.post("updateMany", (doc) => {
//   console.log(doc);
// });
export const Notification = mongoose.model("notifications", notificationSchema);
