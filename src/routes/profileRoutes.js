import express from 'express';
import Profile from '../models/Profile.js';
import protect from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let profile = await Profile.findOne({});
    if (!profile) {
      profile = await Profile.create({});
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/', protect, upload.single('avatar'), async (req, res) => {
  try {
    let profile = await Profile.findOne({});
    if (!profile) {
      profile = await Profile.create({});
    }

    const { name, subtitle, domains, email, linkedin, github } = req.body;

    if (name !== undefined) profile.name = name;
    if (subtitle !== undefined) profile.subtitle = subtitle;
    if (email !== undefined) profile.email = email;
    if (linkedin !== undefined) profile.linkedin = linkedin;
    if (github !== undefined) profile.github = github;

    if (domains !== undefined) {
      profile.domains = typeof domains === 'string' ? JSON.parse(domains) : domains;
    }

    if (req.file) {
      profile.avatarUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await profile.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
