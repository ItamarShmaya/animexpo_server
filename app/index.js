import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import "../db/index.js";
import { userRouter } from "./routes/users/users.routes.js";
import { getUserNotifications } from "./utils/notifications.js";
import { addUser, getUser, removeUser } from "./utils/users.js";
import { getUpdatedFriendsList } from "./utils/friendslist.js";
const app = express();

const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", userRouter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", async (socket) => {
  socket.on("new_user", async ({ username }) => {
    try {
      await addUser(username, socket.id);
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("username_to_notify", async ({ recipient }) => {
    try {
      const users = await getUser(recipient);
      const notifs = await getUserNotifications(recipient);
      users.forEach((user) => {
        io.to(user.socketId).emit("recieve_notifs", { notifs });
      });
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("accepter_client_lists_updates", async ({ accepter }) => {
    try {
      const acceptertUsers = await getUser(accepter);
      const friendsList = await getUpdatedFriendsList(accepter);
      acceptertUsers.forEach((user) => {
        io.to(user.socketId).emit("updated_accepter_friendslist", {
          friendsList,
        });
      });
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("reciever_client_lists_updates", async ({ accepter, reciever }) => {
    try {
      const recievertUsers = await getUser(reciever);
      const accepterFriendsList = await getUpdatedFriendsList(accepter);
      const recieverFriendsList = await getUpdatedFriendsList(reciever);
      recievertUsers.forEach((user) => {
        io.to(user.socketId).emit("updated_reciever_friendslist", {
          accepterFriendsList,
          recieverFriendsList,
        });
      });
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("remover_client_lists_updates", async ({ remover, removed }) => {
    try {
      const removertUsers = await getUser(remover);
      const removedFriendsList = await getUpdatedFriendsList(removed);
      const removerFriendsList = await getUpdatedFriendsList(remover);
      removertUsers.forEach((user) => {
        io.to(user.socketId).emit("updated_remover_friendslist", {
          removedFriendsList,
          removerFriendsList,
        });
      });
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("removed_client_lists_updates", async ({ removed }) => {
    try {
      const removedtUsers = await getUser(removed);
      const friendsList = await getUpdatedFriendsList(removed);
      removedtUsers.forEach((user) => {
        io.to(user.socketId).emit("updated_removed_friendslist", {
          friendsList,
        });
      });
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("logout", async ({ socketId }) => {
    try {
      await removeUser(socketId);
    } catch (e) {
      console.log(e);
    }
  });
  socket.on("disconnect", async () => {
    console.log("why ", new Date());
    try {
      await removeUser(socket.id);
    } catch (e) {
      console.log(e);
    }
  });
});

// app.listen(PORT, (err) => {
//   if (err) return console.log(err);
//   console.log(`Server is up at port ${PORT}`);
// });

server.listen(PORT, () => {
  console.log(`Socket Server is up at port ${PORT}`);
});
