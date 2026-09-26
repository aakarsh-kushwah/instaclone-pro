import { Op } from 'sequelize';
import { Post, User, Like, Comment } from '../models/index.js';

export const createPost = async (req, res) => {
  try {
    const { caption, location, hashtags, visibility = 'public' } = req.body;
    const images = req.files?.map((file) => file.path) || [];

    const post = await Post.create({
      userId: req.user.id,
      caption,
      image: images[0] || '',
      images,
      location,
      hashtags: hashtags ? hashtags.split(',') : [],
      visibility
    });

    const user = await User.findByPk(req.user.id);
    user.postsCount = (user.postsCount || 0) + 1;
    await user.save();

    res.status(201).json({ message: 'Post created', post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeed = async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const offset = (page - 1) * limit;

    const follows = await req.db?.Follow?.findAll ? await req.db.Follow.findAll({ where: { followerId: req.user.id, status: 'accepted' } }) : [];
    const followedIds = follows.map((f) => f.followingId);
    followedIds.push(req.user.id);

    const posts = await Post.findAll({
      where: {
        [Op.or]: [
          { userId: { [Op.in]: followedIds } },
          { visibility: 'public' }
        ]
      },
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatar', 'fullName'] }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({ posts, page, limit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: User, as: 'author' }]
    });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Like.findOne({ where: { userId: req.user.id, postId: id } });

    if (existing) {
      await existing.destroy();
      const post = await Post.findByPk(id);
      post.likes = Math.max(0, post.likes - 1);
      await post.save();
      return res.json({ liked: false, likes: post.likes });
    }

    await Like.create({ userId: req.user.id, postId: id, type: 'like' });
    const post = await Post.findByPk(id);
    post.likes = (post.likes || 0) + 1;
    await post.save();
    res.json({ liked: true, likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text required' });

    const comment = await Comment.create({ userId: req.user.id, postId: id, text });
    const post = await Post.findByPk(id);
    post.comments = (post.comments || 0) + 1;
    await post.save();

    res.status(201).json({ comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.userId !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    await post.destroy();
    const user = await User.findByPk(req.user.id);
    user.postsCount = Math.max(0, user.postsCount - 1);
    await user.save();

    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
