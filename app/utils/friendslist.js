import { FriendsList } from "../../db/models/friendsList.js";
import { User } from "../../db/models/user.js";

export const getUpdatedFriendsList = async (username) => {
  try {
    const user = await User.findOne({ username });
    const friendsList = await FriendsList.findOne({ owner: user._id }).populate(
      {
        path: "list",
        options: { limit: 8, sort: { createdAt: "desc" } },
      }
    );
    return friendsList;
  } catch (e) {
    throw e;
  }
};
