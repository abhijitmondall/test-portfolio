import { Router, Request, Response, NextFunction } from "express";
import slugify from "slugify";
import { prisma } from "..";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// GET /api/projects - Public
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { featured, published = "true", category } = req.query;
      const where: Record<string, unknown> = {};
      if (published !== "all") where.published = published === "true";
      if (featured === "true") where.featured = true;
      if (category) where.category = category;

      const projects = await prisma.project.findMany({
        where,
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      });
      res.json({ success: true, data: projects });
    } catch (err) {
      next(err);
    }
  },
);

// GET /api/projects/:slug - Public
router.get(
  "/:slug",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const project = await prisma.project.findUnique({
        where: { slug: req.params.slug },
      });
      if (!project) {
        res.status(404).json({ success: false, message: "Project not found" });
        return;
      }
      res.json({ success: true, data: project });
    } catch (err) {
      next(err);
    }
  },
);

// POST /api/projects - Admin
router.post(
  "/",
  authenticate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { title, ...rest } = req.body;
      const slug = slugify(title, { lower: true, strict: true });
      const project = await prisma.project.create({
        data: { title, slug, ...rest },
      });
      res.status(201).json({ success: true, data: project });
    } catch (err) {
      next(err);
    }
  },
);

// PUT /api/projects/:id - Admin
router.put(
  "/:id",
  authenticate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { title, ...rest } = req.body;
      const slug = title
        ? slugify(title, { lower: true, strict: true })
        : undefined;
      const project = await prisma.project.update({
        where: { id: req.params.id },
        data: { title, ...(slug && { slug }), ...rest },
      });
      res.json({ success: true, data: project });
    } catch (err) {
      next(err);
    }
  },
);

// DELETE /api/projects/:id - Admin
router.delete(
  "/:id",
  authenticate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await prisma.project.delete({ where: { id: req.params.id } });
      res.json({ success: true, message: "Project deleted" });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
