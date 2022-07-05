import express from "express";
import cors from "cors";
import "../db/index.js";
import { userRouter } from "./routes/users/users.routes.js";
const app = express();

const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", userRouter);

app.listen(PORT, (err) => {
  if (err) return console.log(err);
  console.log(`Server is up at port ${PORT}`);
});
