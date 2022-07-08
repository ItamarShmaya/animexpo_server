import multer from "multer";
import { errorMessage } from "../errors/error.js";

const options = {
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      req.imageValidationError = errorMessage.NOT_AN_IMAGE;
      return cb(null, false, req.imageValidationError);
    }
    cb(undefined, true);
  },
};

const multerUpload = multer(options).single("avatar");
export { multerUpload };
