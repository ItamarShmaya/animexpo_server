import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import "../db/index.js";
import { userRouter } from "./routes/users/users.routes.js";
import { getUserNotifications } from "./utils/notifications.js";
import { getUpdatedFriendsList } from "./utils/friendslist.js";
import uniqid from "uniqid";
import RedisSessionStore from "./utils/sessionStore.js";
import Redis from "ioredis";
import { REDIS_URL } from "../config/env_var.js";

const redisClient = new Redis(REDIS_URL);

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

const sessionStore = new RedisSessionStore(redisClient);

io.use(async (socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  const username = socket.handshake.auth.username;
  console.log(sessionID, username);
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
  sessionStore.saveSession(socket.sessionID, {
    socketID: socket.id,
    username: socket.username,
  });

  socket.emit("session", { sessionID: socket.sessionID });

  socket.on("online_users", async () => {
    const users = await sessionStore.findAllSessions();
    console.log(users);
    socket.emit("online_users", { users });
  });

  socket.on("friend_req", async ({ to }) => {
    try {
      if (to.length > 0) {
        const notifications = await getUserNotifications(to[0].username);
        for (let user of to) {
          io.to(user.socketID).emit("new_notifications", { notifications });
        }
      }
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("accept_friend_req", async ({ from }) => {
    try {
      if (from.length > 0) {
        const notifications = await getUserNotifications(from[0].username);
        const friendsList = await getUpdatedFriendsList(from[0].username);
        for (let user of from) {
          io.to(user.socketID).emit("new_notifications", { notifications });
          io.to(user.socketID).emit("updated_friendslist", { friendsList });
        }
      }
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("reject_friend_req", async ({ from }) => {
    try {
      if (from.length > 0) {
        const notifications = await getUserNotifications(from[0].username);
        for (let user of from) {
          io.to(user.socketID).emit("new_notifications", { notifications });
        }
      }
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("remove_friend", async ({ to }) => {
    try {
      if (to.length > 0) {
        const notifications = await getUserNotifications(to[0].username);
        const friendsList = await getUpdatedFriendsList(to[0].username);
        for (let user of to) {
          io.to(user.socketID).emit("new_notifications", { notifications });
          io.to(user.socketID).emit("updated_friendslist", { friendsList });
        }
      }
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("logout", async () => {
    sessionStore.deleteSession(socket.sessionID);
  });

  socket.on("disconnect", async (reason) => {
    console.log("Socket disconnected because of " + reason);
    sessionStore.deleteSession(socket.sessionID);
  });
});

server.listen(PORT, () => {
  console.log(`Socket Server is up at port ${PORT}`);
});
