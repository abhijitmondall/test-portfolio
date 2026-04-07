import { Router, Request, Response } from "express";
import { prisma } from "..";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", async (_req, res: Response): Promise<void> => {
  try {
    const settings = await prisma.setting.findMany();
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    res.json({ success: true, data: map });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put(
  "/",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const entries = Object.entries(req.body as Record<string, string>);
      await Promise.all(
        entries.map(([key, value]) =>
          prisma.setting.upsert({
            where: { key },
            create: { key, value },
            update: { value },
          }),
        ),
      );
      res.json({ success: true, message: "Settings updated" });
    } catch {
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
);

export default router;
