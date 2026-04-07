import { Router, Request, Response } from "express";
import { prisma } from "..";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Messages - public POST, admin GET/PATCH/DELETE
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const msg = await prisma.message.create({ data: req.body });
    res
      .status(201)
      .json({ success: true, data: msg, message: "Message sent successfully" });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get(
  "/",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { status } = req.query;
      const where = status ? { status: status as string } : {};
      const messages = await prisma.message.findMany({
        where: where as Record<string, unknown>,
        orderBy: { createdAt: "desc" },
      });
      res.json({ success: true, data: messages });
    } catch {
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
);

router.patch(
  "/:id/status",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const msg = await prisma.message.update({
        where: { id: req.params.id },
        data: { status: req.body.status },
      });
      res.json({ success: true, data: msg });
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
      await prisma.message.delete({ where: { id: req.params.id } });
      res.json({ success: true, message: "Deleted" });
    } catch {
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
);

export default router;
