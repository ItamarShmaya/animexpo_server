import dotenv from "dotenv";
import path from "path";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const CONFIG_DIR_PATH = __dirname;
const ENV_FILE_PATH = path.join(CONFIG_DIR_PATH, "../.env");

dotenv.config({ path: ENV_FILE_PATH });

export const {
  MONGO_ATLAS_USERNAME,
  MONGO_ATLAS_PASSWORD,
  TOKEN_USER_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  REDIS_URL,
} = process.env;
