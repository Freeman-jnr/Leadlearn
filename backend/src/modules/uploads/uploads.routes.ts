import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { upload } from "../../middleware/upload";
import { asyncHandler } from "../../utils/asyncHandler";
import { created } from "../../utils/response";
import { BadRequest } from "../../utils/errors";

const r = Router();
r.use(authenticate);

r.post(
  "/single",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const f = req.file as Express.Multer.File & { path?: string; filename?: string };
    if (!f) throw BadRequest("No file uploaded");
    return created(res, {
      url: f.path,
      filename: f.filename,
      mimetype: f.mimetype,
      size: f.size,
    });
  })
);

r.post(
  "/multiple",
  upload.array("files", 10),
  asyncHandler(async (req, res) => {
    const files = (req.files as (Express.Multer.File & { path?: string })[]) || [];
    return created(
      res,
      files.map((f) => ({ url: f.path, filename: f.filename, mimetype: f.mimetype }))
    );
  })
);

export default r;
