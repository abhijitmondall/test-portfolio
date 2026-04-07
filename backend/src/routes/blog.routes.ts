import { Router, Request, Response } from "express";
import slugify from "slugify";
import { prisma } from "..";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { published, featured, tag } = req.query;
    const where: Record<string, unknown> = {};
    if (published !== "all") where.published = true;
    if (featured === "true") where.featured = true;
    if (tag) where.tags = { has: tag as string };

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        thumbnail: true,
        tags: true,
        published: true,
        featured: true,
        views: true,
        readingTime: true,
        publishedAt: true,
        createdAt: true,
      },
    });
    res.json({ success: true, data: posts });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/:slug", async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: req.params.slug },
    });
    if (!post || !post.published) {
      res.status(404).json({ success: false, message: "Post not found" });
      return;
    }
    // Increment views
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });
    res.json({ success: true, data: post });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Admin: get all posts including drafts
router.get(
  "/admin/all",
  authenticate,
  async (_req, res: Response): Promise<void> => {
    try {
      const posts = await prisma.blogPost.findMany({
        orderBy: { createdAt: "desc" },
      });
      res.json({ success: true, data: posts });
    } catch {
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
);

router.post(
  "/",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, published, ...rest } = req.body;
      const slug = slugify(title, { lower: true, strict: true });
      const post = await prisma.blogPost.create({
        data: {
          title,
          slug,
          published,
          publishedAt: published ? new Date() : null,
          ...rest,
        },
      });
      res.status(201).json({ success: true, data: post });
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
      const { title, published, ...rest } = req.body;
      const existing = await prisma.blogPost.findUnique({
        where: { id: req.params.id },
      });
      const slug = title
        ? slugify(title, { lower: true, strict: true })
        : undefined;
      const post = await prisma.blogPost.update({
        where: { id: req.params.id },
        data: {
          title,
          ...(slug && { slug }),
          published,
          publishedAt:
            published && !existing?.publishedAt
              ? new Date()
              : existing?.publishedAt,
          ...rest,
        },
      });
      res.json({ success: true, data: post });
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
      await prisma.blogPost.delete({ where: { id: req.params.id } });
      res.json({ success: true, message: "Deleted" });
    } catch {
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
);

export default router;
