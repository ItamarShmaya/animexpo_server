import mongoose from "mongoose";
import {
  MONGO_ATLAS_USERNAME,
  MONGO_ATLAS_PASSWORD,
} from "../config/env_var.js";

mongoose.connect(
  "mongodb://127.0.0.1:27017/AnimeList",
  (error, mongoDBInstance) => {
    if (error) throw new Error("Mongo Connection Error: " + error);
    if (!process.env.NODE_ENV) {
      const { host, port, name } = mongoDBInstance;
      console.log({ host, port, name });
    }
  },
  {
    useCreateIndex: true,
    autoIndex: true,
  }
);

// const URI = `mongodb+srv://${MONGO_ATLAS_USERNAME}:${MONGO_ATLAS_PASSWORD}@animeexpo.6seaw.mongodb.net/AnimeExpo?retryWrites=true&w=majority`;

// mongoose.connect(URI, (error, mongoDBInstance) => {
//   if (error) throw new Error("Mongo Connection Error: " + error);
//   if (!process.env.NODE_ENV) {
//     const { host, port, name } = mongoDBInstance;
//     console.log({ host, port, name });
//   }
// });
