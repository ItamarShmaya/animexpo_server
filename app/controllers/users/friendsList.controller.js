import { FriendsList } from "../../../db/models/friendsList.js";
import { FriendsRequest } from "../../../db/models/friendRequest.js";
import { User } from "../../../db/models/user.js";
import { Notification } from "../../../db/models/notifications.js";

export const sendFriendRequest = async (req, res) => {
  const { toUsername } = req.body;
  try {
    const recipient = await User.findOne({ username: toUsername });
    const friendRequest = new FriendsRequest({
      requester: req.user._id,
      recipient: recipient._id,
      status: 1,
    });

    await friendRequest.save();
    if (friendRequest) res.send(friendRequest);
  } catch (e) {
    console.log(e);
  }
};

export const acceptFriendRequest = async (req, res) => {
  const { id } = req.body;
  try {
    const friendRequest = await FriendsRequest.findOne({
      requester: id,
      recipient: req.user._id,
      status: 1,
    });
    friendRequest.status = 2;
    await friendRequest.save();

    const updatedFriendsList = await FriendsList.findOne({
      owner: req.user._id,
    }).populate({
      path: "list",
      options: { limit: 8, sort: { createdAt: "desc" } },
    });
    const updatedFriendRequestsList = await FriendsRequest.find({
      recipient: req.user._id,
    }).populate("requester");
    res.send({ updatedFriendsList, updatedFriendRequestsList });
  } catch (e) {
    console.log(e);
  }
};

export const rejectFriendRequest = async (req, res) => {
  const { id } = req.body;
  try {
    const friendRequest = await FriendsRequest.findOne({
      requester: id,
      recipient: req.user._id,
      status: 1,
    });
    friendRequest.status = 3;
    await friendRequest.save();

    const updatedFriendRequestsList = await FriendsRequest.find({
      recipient: req.user._id,
    }).populate("requester");
    res.send(updatedFriendRequestsList);
  } catch (e) {
    console.log(e);
  }
};

export const getUserFriendRequests = async (req, res) => {
  try {
    const friendRequests = await FriendsRequest.find({
      recipient: req.user._id,
    }).populate("requester");
    res.send(friendRequests);
  } catch (e) {
    console.log(e);
  }
};

export const getUserFriendsList = async (req, res) => {
  try {
    const friendsList = await FriendsList.findOne({
      owner: req.user._id,
    }).populate("list");
    res.send(friendsList);
  } catch (e) {
    console.log(e);
  }
};

export const isUserInFriendsList = async (req, res) => {
  const { friendUsername } = req.body;
  try {
    const friendsList = await FriendsList.findOne({
      owner: req.user._id,
    });

    const friendUser = await User.findOne({ username: friendUsername });

    const friend = friendsList.list.find(
      (friend) => friend.toString() === friendUser._id.toString()
    );

    friend ? res.send(true) : res.send(false);
  } catch (e) {
    console.log(e);
  }
};

export const wasFriendRequestSent = async (req, res) => {
  const { friendUsername } = req.body;
  try {
    const friendUser = await User.findOne({ username: friendUsername });

    const friendRequest = await FriendsRequest.findOne({
      requester: req.user._id,
      recipient: friendUser._id,
      status: 1,
    });

    friendRequest ? res.send(true) : res.send(false);
  } catch (e) {
    console.log(e);
  }
};

export const removeFriend = async (req, res) => {
  const { friendUsername } = req.body;
  try {
    const friendUser = await User.findOne({ username: friendUsername });

    const friendUserId = friendUser._id;
    const loggedInUserId = req.user._id;

    const friendUserFriendsList = await FriendsList.findOneAndUpdate(
      { owner: friendUserId },
      { $pull: { list: loggedInUserId } }
    );

    const newNotif = new Notification({
      requester: loggedInUserId,
      recipient: friendUserId,
      type: 4,
    });
    await newNotif.save();
    const loggedInUserFriendsList = await FriendsList.findOneAndUpdate(
      { owner: req.user._id },
      { $pull: { list: friendUserId } },
      { new: true }
    ).populate({
      path: "list",
      options: { limit: 8, sort: { createdAt: "desc" } },
    });
    if (loggedInUserFriendsList) res.send(loggedInUserFriendsList);
  } catch (e) {
    console.log(e);
  }
};
