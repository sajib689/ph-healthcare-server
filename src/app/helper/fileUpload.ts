import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

const uploadFileToCloudinary = async (file: Express.Multer.File) => {
    console.log("file:", file)
    // configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    })
    // upload an image
    const uploadResult = await cloudinary.uploader.upload("",{
      public_id: ""
    })
    .catch((error) => {
      console.log(error)
    })
};

export const fileUploader = {
  upload,
  uploadFileToCloudinary
};
