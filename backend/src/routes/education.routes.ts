import { Router, Request, Response } from "express";
import { prisma } from "..";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", async (_req, res: Response): Promise<void> => {
  try {
    const items = await prisma.education.findMany({
      orderBy: [{ order: "asc" }, { startDate: "desc" }],
    });
    res.json({ success: true, data: items });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post(
  "/",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const item = await prisma.education.create({ data: req.body });
      res.status(201).json({ success: true, data: item });
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
      const item = await prisma.education.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json({ success: true, data: item });
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
      await prisma.education.delete({ where: { id: req.params.id } });
      res.json({ success: true, message: "Deleted" });
    } catch {
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
);

export default router;
