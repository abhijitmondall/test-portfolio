import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "..";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get(
  "/",
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const experiences = await prisma.experience.findMany({
        orderBy: [{ order: "asc" }, { startDate: "desc" }],
      });
      res.json({ success: true, data: experiences });
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/",
  authenticate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const exp = await prisma.experience.create({ data: req.body });
      res.status(201).json({ success: true, data: exp });
    } catch (err) {
      next(err);
    }
  },
);

router.put(
  "/:id",
  authenticate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const exp = await prisma.experience.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json({ success: true, data: exp });
    } catch (err) {
      next(err);
    }
  },
);

router.delete(
  "/:id",
  authenticate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await prisma.experience.delete({ where: { id: req.params.id } });
      res.json({ success: true, message: "Deleted" });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
