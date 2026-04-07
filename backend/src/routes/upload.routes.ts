import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = "uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg|pdf/;
    const valid = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
    if (valid) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

router.post("/image", authenticate, upload.single("file"), (req: Request, res: Response): void => {
  if (!req.file) { res.status(400).json({ success: false, message: "No file uploaded" }); return; }
  const url = `${process.env.API_URL || "http://localhost:5000"}/uploads/${req.file.filename}`;
  res.json({ success: true, data: { url, filename: req.file.filename } });
});

router.post("/images", authenticate, upload.array("files", 10), (req: Request, res: Response): void => {
  if (!req.files || !Array.isArray(req.files)) { res.status(400).json({ success: false, message: "No files" }); return; }
  const urls = req.files.map((f) => ({
    url: `${process.env.API_URL || "http://localhost:5000"}/uploads/${f.filename}`,
    filename: f.filename,
  }));
  res.json({ success: true, data: urls });
});

export default router;
