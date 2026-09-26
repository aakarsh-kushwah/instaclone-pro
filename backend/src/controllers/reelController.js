import { Reel, User, Like, Comment } from '../models/index.js';

export const createReel = async (req, res) => {
  try {
    const { caption, music, musicName, musicArtist, hashtags } = req.body;
    const videoPath = req.file?.path;

    if (!videoPath) return res.status(400).json({ message: 'Video required' });

    const reel = await Reel.create({
      userId: req.user.id,
      caption,
      video: videoPath,
      music,
      musicName,
      musicArtist,
      hashtags: hashtags ? hashtags.split(',') : []
    });

    const user = await User.findByPk(req.user.id);
    user.reelsCount = (user.reelsCount || 0) + 1;
    await user.save();

    res.status(201).json({ message: 'Reel created', reel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReels = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const reels = await Reel.findAll({
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({ reels, page });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const likeReel = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Like.findOne({
      where: { userId: req.user.id, reelId: id }
    });

    if (existing) {
      await existing.destroy();
      const reel = await Reel.findByPk(id);
      reel.likes = Math.max(0, reel.likes - 1);
      await reel.save();
      return res.json({ liked: false });
    }

    await Like.create({ userId: req.user.id, reelId: id });
    const reel = await Reel.findByPk(id);
    reel.likes = (reel.likes || 0) + 1;
    await reel.save();
    res.json({ liked: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const commentReel = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const comment = await Comment.create({
      userId: req.user.id,
      reelId: id,
      text
    });

    const reel = await Reel.findByPk(id);
    reel.comments = (reel.comments || 0) + 1;
    await reel.save();

    res.status(201).json({ comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const viewReel = async (req, res) => {
  try {
    const reel = await Reel.findByPk(req.params.id);
    if (!reel) return res.status(404).json({ message: 'Reel not found' });
    
    reel.views = (reel.views || 0) + 1;
    await reel.save();
    res.json({ views: reel.views });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
