import { Story, User } from '../models/index.js';
import { Op } from 'sequelize';

export const createStory = async (req, res) => {
  try {
    const { caption, mediaType, music, musicName, musicArtist, stickers, filters, allowReply } = req.body;
    const mediaPath = req.file?.path;

    if (!mediaPath) return res.status(400).json({ message: 'Media required' });

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const story = await Story.create({
      userId: req.user.id,
      media: mediaPath,
      mediaType: mediaType || 'image',
      caption,
      music,
      musicName,
      musicArtist,
      stickers: stickers ? JSON.parse(stickers) : [],
      filters: filters ? JSON.parse(filters) : {},
      expiresAt,
      allowReply: allowReply !== false
    });

    const user = await User.findByPk(req.user.id);
    user.storiesCount = (user.storiesCount || 0) + 1;
    await user.save();

    res.status(201).json({ message: 'Story created', story, expiresIn: '24h' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStories = async (req, res) => {
  try {
    const stories = await Story.findAll({
      where: {
        expiresAt: { [Op.gt]: new Date() }
      },
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ stories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserStories = async (req, res) => {
  try {
    const { userId } = req.params;
    const stories = await Story.findAll({
      where: {
        userId,
        expiresAt: { [Op.gt]: new Date() }
      },
      order: [['createdAt', 'DESC']]
    });

    res.json({ stories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const viewStory = async (req, res) => {
  try {
    const story = await Story.findByPk(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    
    story.views = (story.views || 0) + 1;
    await story.save();
    res.json({ views: story.views });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStory = async (req, res) => {
  try {
    const story = await Story.findByPk(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    if (story.userId !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    await story.destroy();
    res.json({ message: 'Story deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
