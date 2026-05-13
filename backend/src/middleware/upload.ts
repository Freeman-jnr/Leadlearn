import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../services/cloudinary.service";
import { env } from "../config/env";

const useCloud = !!env.CLOUDINARY_CLOUD_NAME;

const storage = useCloud
  ? new CloudinaryStorage({
      cloudinary,
      params: async (_req, file) => ({
        folder: "leadlearnhub",
        resource_type: file.mimetype.startsWith("video") ? "video" : "auto",
      }),
    })
  : multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB max
  fileFilter: (_req, file, cb) => {
    const allowed = /image|video|pdf|msword|officedocument|zip/;
    if (allowed.test(file.mimetype)) cb(null, true);
    else cb(new Error("Unsupported file type"));
  },
});
