import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "..";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// GET all categories with skills
router.get(
  "/",
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await prisma.skillCategory.findMany({
        include: { skills: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" },
      });
      res.json({ success: true, data: categories });
    } catch (err) {
      next(err);
    }
  },
);

// Category CRUD
router.post(
  "/categories",
  authenticate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cat = await prisma.skillCategory.create({ data: req.body });
      res.status(201).json({ success: true, data: cat });
    } catch (err) {
      next(err);
    }
  },
);

router.put(
  "/categories/:id",
  authenticate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cat = await prisma.skillCategory.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json({ success: true, data: cat });
    } catch (err) {
      next(err);
    }
  },
);

router.delete(
  "/categories/:id",
  authenticate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await prisma.skillCategory.delete({ where: { id: req.params.id } });
      res.json({ success: true, message: "Deleted" });
    } catch (err) {
      next(err);
    }
  },
);

// Skill CRUD
router.post(
  "/",
  authenticate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const skill = await prisma.skill.create({ data: req.body });
      res.status(201).json({ success: true, data: skill });
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
      const skill = await prisma.skill.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json({ success: true, data: skill });
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
      await prisma.skill.delete({ where: { id: req.params.id } });
      res.json({ success: true, message: "Deleted" });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
