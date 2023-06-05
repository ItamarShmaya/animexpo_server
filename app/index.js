import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import "../db/index.js";
import { userRouter } from "./routes/users/users.routes.js";
import { getUserNotifications } from "./utils/notifications.js";
import { getUpdatedFriendsList } from "./utils/friendslist.js";
import uniqid from "uniqid";
import InMemorySessionStore from "./utils/sessionStore.js";

const app = express();

const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", userRouter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://animexpoclient.onrender.com",
  },
});
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });

let setTimeoutId;

const sessionStore = new InMemorySessionStore();

io.use(async (socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  const username = socket.handshake.auth.username;

  if (sessionID) {
    socket.sessionID = sessionID;
    socket.username = username;
    return next();
  }

  socket.sessionID = uniqid();
  socket.username = username;
  next();
});

io.on("connection", async (socket) => {
  clearTimeout(setTimeoutId);

  sessionStore.saveSession(socket.sessionID, {
    socketID: socket.id,
    username: socket.username,
    online: true,
  });

  console.log("all sessions", sessionStore.findAllSessions());
  socket.emit("session", { sessionID: socket.sessionID });

  socket.on("online_users", async () => {
    const users = sessionStore.findAllSessions();
    console.log("online_users");
    socket.emit("online_users", { users });
  });

  socket.on("friend_req", async ({ to }) => {
    try {
      const notifications = await getUserNotifications(to.username);
      io.to(to.socketID).emit("new_notifications", { notifications });
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("accept_friend_req", async ({ from }) => {
    try {
      const notifications = await getUserNotifications(from.username);
      io.to(from.socketID).emit("new_notifications", { notifications });
      const friendsList = await getUpdatedFriendsList(from.username);
      io.to(from.socketID).emit("updated_friendslist", { friendsList });
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("reject_friend_req", async ({ from }) => {
    try {
      const notifications = await getUserNotifications(from.username);
      io.to(from.socketID).emit("new_notifications", { notifications });
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("remove_friend", async ({ to }) => {
    try {
      const notifications = await getUserNotifications(to.username);
      io.to(to.socketID).emit("new_notifications", { notifications });
      const friendsList = await getUpdatedFriendsList(to.username);
      io.to(to.socketID).emit("updated_friendslist", { friendsList });
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("logout", async () => {
    try {
      sessionStore.deleteSession(socket.sessionID);
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("disconnect", async (reason) => {
    console.log("Socket disconnected because of " + reason);
    // setTimeoutId = setTimeout(async () => {
    //   sessionStore.deleteSession(socket.sessionID);
    // }, 60000);
  });
});

server.listen(PORT, () => {
  console.log(`Socket Server is up at port ${PORT}`);
});
