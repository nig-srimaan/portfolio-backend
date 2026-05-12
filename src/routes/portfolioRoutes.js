import express from 'express';
import PortfolioItem from '../models/PortfolioItem.js';
import protect from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import path from 'path';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const items = await PortfolioItem.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await PortfolioItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post(
  '/',
  protect,
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'media', maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const { title, description, category, skills, whatILearned, externalLink, githubLink, featured } =
        req.body;

      const skillsArray = typeof skills === 'string' ? JSON.parse(skills) : skills;

      let thumbnailUrl = '';
      let mediaUrls = [];

      if (req.files?.thumbnail?.[0]) {
        thumbnailUrl = `/uploads/${req.files.thumbnail[0].filename}`;
      }

      if (req.files?.media) {
        mediaUrls = req.files.media.map((f) => `/uploads/${f.filename}`);
      }

      const item = await PortfolioItem.create({
        title,
        description,
        category,
        skills: skillsArray,
        whatILearned,
        thumbnailUrl,
        mediaUrls,
        externalLink,
        githubLink,
        featured: featured === 'true',
      });

      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.put(
  '/:id',
  protect,
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'media', maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const item = await PortfolioItem.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Portfolio item not found' });
      }

      const { title, description, category, skills, whatILearned, externalLink, githubLink, featured } =
        req.body;

      const skillsArray = typeof skills === 'string' ? JSON.parse(skills) : skills;

      if (req.files?.thumbnail?.[0]) {
        item.thumbnailUrl = `/uploads/${req.files.thumbnail[0].filename}`;
      }

      if (req.files?.media) {
        item.mediaUrls = req.files.media.map((f) => `/uploads/${f.filename}`);
      }

      item.title = title || item.title;
      item.description = description || item.description;
      item.category = category || item.category;
      item.skills = skillsArray || item.skills;
      item.whatILearned = whatILearned || item.whatILearned;
      item.externalLink = externalLink ?? item.externalLink;
      item.githubLink = githubLink ?? item.githubLink;
      item.featured = featured !== undefined ? featured === 'true' : item.featured;

      const updated = await item.save();
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await PortfolioItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }
    await item.deleteOne();
    res.json({ message: 'Portfolio item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id/like', async (req, res) => {
  try {
    const item = await PortfolioItem.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ likes: item.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
