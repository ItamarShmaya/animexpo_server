import { ProfileData } from "../../../db/models/profileData.js";
import sharp from "sharp";
import { errorCode, errorMessage } from "../../errors/error.js";
import {
  defualtAvatarPublicId,
  deleteImage,
  uploadImage,
} from "../../../config/cloudinaryConfig.js";

export const updateProfileData = async (req, res) => {
  try {
    console.log(req.file);
    console.log(req.body);
    // const profileData = await ProfileData.findOneAndUpdate({ owner: req.user._id }, {personalInfo: req.body});
    // const profileData = await ProfileData.findOne({
    //   owner: req.user._id,
    // });
    // console.log(profileData);
  } catch (e) {
    res.status(404).send(e);
  }
};

export const updateAvatar = async (req, res) => {
  try {
    if (req.imageValidationError === errorMessage.NOT_AN_IMAGE)
      throw new Error(errorMessage.NOT_AN_IMAGE);

    if (req.file) {
      const buffer = await sharp(req.file.buffer)
        .resize({ width: 200, height: 175 })
        .png()
        .toBuffer();

      const profileData = await ProfileData.findOne({ owner: req.user._id });
      const imageToDelete = profileData.personalInfo.avatar.public_id;

      if (imageToDelete !== defualtAvatarPublicId) {
        const deleteResponse = await deleteImage(imageToDelete);
        if (deleteResponse.error) throw new Error();
      }

      const uploadResult = await uploadImage(
        "avatars",
        req.user.username,
        buffer
      );

      profileData.personalInfo.avatar = {
        secure_url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
      req.user.avatar = {
        secure_url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
      req.user.save();
      const updatedProfileData = await profileData.save();
      await updatedProfileData.populate(
        "favoriteAnime favoriteManga favoriteCharacters favoriteStaff friendsList"
      );
      res.send(updatedProfileData);
    }
  } catch (e) {
    if (e.message === errorMessage.NOT_AN_IMAGE) {
      return res.status(400).send(errorCode.NOT_AN_IMAGE);
    }

    res.status(404).send(e);
  }
};
