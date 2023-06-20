import mongoose from "mongoose";
import {
  MONGO_ATLAS_USERNAME,
  MONGO_ATLAS_PASSWORD,
} from "../config/env_var.js";

if (process.env.NODE_ENV === "production") {
  const URI = `mongodb+srv://${MONGO_ATLAS_USERNAME}:${MONGO_ATLAS_PASSWORD}@animexpocluster.iwm14bx.mongodb.net/AnimeExpo?retryWrites=true&w=majority`;

  mongoose.connect(URI, (error, mongoDBInstance) => {
    if (error) throw new Error("Mongo Connection Error: " + error);
    const { host, port, name } = mongoDBInstance;
    console.log({ host, port, name });
  });
} else {
  mongoose.connect(
    "mongodb://127.0.0.1:27017/AnimExpo",
    (error, mongoDBInstance) => {
      if (error) throw new Error("Mongo Connection Error: " + error);
      const { host, port, name } = mongoDBInstance;
      console.log({ host, port, name });
      // mongoose.connection.db.dropDatabase();
    },
    {
      useCreateIndex: true,
      autoIndex: true,
    }
  );
}
