import { Router, Request, Response } from "express";
import { prisma } from "..";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", async (_req, res: Response): Promise<void> => {
  try {
    const links = await prisma.socialLink.findMany({
      orderBy: { order: "asc" },
    });
    res.json({ success: true, data: links });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post(
  "/",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const link = await prisma.socialLink.create({ data: req.body });
      res.status(201).json({ success: true, data: link });
    } catch {
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
);

router.put(
  "/:id",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const link = await prisma.socialLink.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json({ success: true, data: link });
    } catch {
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
);

router.delete(
  "/:id",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      await prisma.socialLink.delete({ where: { id: req.params.id } });
      res.json({ success: true, message: "Deleted" });
    } catch {
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
);

export default router;
