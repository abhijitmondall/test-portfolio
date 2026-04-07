import { Router, Request, Response } from "express";
import { prisma } from "..";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// GET /api/profile - Public
router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const profile = await prisma.profile.findFirst();
    res.json({ success: true, data: profile });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT /api/profile - Admin only (upsert)
router.put(
  "/",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const existing = await prisma.profile.findFirst();
      const data = req.body;

      const profile = existing
        ? await prisma.profile.update({ where: { id: existing.id }, data })
        : await prisma.profile.create({ data });

      res.json({ success: true, data: profile });
    } catch {
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
);

export default router;
