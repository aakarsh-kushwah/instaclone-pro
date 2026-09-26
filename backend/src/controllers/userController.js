import { Op } from 'sequelize';
import { User, Follow, Notification, Post, Reel } from '../models/index.js';

export const searchUsers = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json({ users: [] });

    const users = await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: `%${q}%` } },
          { fullName: { [Op.like]: `%${q}%` } }
        ]
      },
      attributes: { exclude: ['password'] },
      limit: 12
    });

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isFollowing = await Follow.findOne({
      where: { followerId: req.user.id, followingId: id }
    });

    const followersCount = await Follow.count({ where: { followingId: id } });
    const followingCount = await Follow.count({ where: { followerId: id } });

    res.json({
      ...user.toJSON(),
      isFollowing: !!isFollowing,
      followersCount,
      followingCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { bio, avatar, isPrivate, fullName, website } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.bio = bio ?? user.bio;
    user.avatar = avatar ?? user.avatar;
    user.fullName = fullName ?? user.fullName;
    user.website = website ?? user.website;
    user.isPrivate = typeof isPrivate === 'boolean' ? isPrivate : user.isPrivate;
    await user.save();

    res.json({ message: 'Profile updated', user: { ...user.toJSON(), password: undefined } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleFollow = async (req, res) => {
  try {
    const targetId = Number(req.params.id);
    if (targetId === req.user.id) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const targetUser = await User.findByPk(targetId);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    const existing = await Follow.findOne({
      where: { followerId: req.user.id, followingId: targetId }
    });

    if (existing) {
      await existing.destroy();
      return res.json({ following: false, status: 'unfollowed' });
    }

    if (targetUser.isPrivate) {
      const followRequest = await Follow.create({
        followerId: req.user.id,
        followingId: targetId,
        status: 'pending'
      });

      await Notification.create({
        userId: targetId,
        fromUserId: req.user.id,
        type: 'follow',
        title: 'New follow request',
        message: `${req.user.username || 'Someone'} requested to follow you`,
        actionUrl: `/profile/${req.user.id}`
      });

      return res.status(200).json({ following: false, status: 'pending', followRequest });
    }

    const follow = await Follow.create({
      followerId: req.user.id,
      followingId: targetId,
      status: 'accepted'
    });

    await Notification.create({
      userId: targetId,
      fromUserId: req.user.id,
      type: 'follow',
      title: 'New follower',
      message: `${req.user.username || 'Someone'} followed you`,
      actionUrl: `/profile/${req.user.id}`
    });

    res.status(201).json({ following: true, status: 'accepted', follow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const handleFollowRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const request = await Follow.findOne({
      where: {
        id,
        followingId: req.user.id,
        status: 'pending'
      }
    });

    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (action === 'accept') {
      request.status = 'accepted';
      await request.save();
      await Notification.create({
        userId: request.followerId,
        fromUserId: req.user.id,
        type: 'follow',
        title: 'Follow request accepted',
        message: 'Your follow request was accepted',
        actionUrl: `/profile/${req.user.id}`
      });
      return res.json({ status: 'accepted' });
    }

    if (action === 'decline') {
      await request.destroy();
      return res.json({ status: 'declined' });
    }

    res.status(400).json({ message: 'Invalid action' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listFollowRequests = async (req, res) => {
  try {
    const requests = await Follow.findAll({
      where: { followingId: req.user.id, status: 'pending' },
      include: [{ model: User, as: 'followerUser', attributes: ['id', 'username', 'avatar', 'fullName'] }]
    });
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { id: { [Op.ne]: req.user.id } },
      attributes: { exclude: ['password'] },
      limit: 10,
      order: [['createdAt', 'DESC']]
    });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeed = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const following = await Follow.findAll({
      where: { followerId: req.user.id, status: 'accepted' },
      attributes: ['followingId']
    });

    const followedIds = following.map((f) => f.followingId);
    followedIds.push(req.user.id);

    const posts = await Post.findAll({
      where: {
        [Op.or]: [
          { userId: { [Op.in]: followedIds } },
          { visibility: 'public' }
        ],
        userId: { [Op.ne]: null }
      },
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatar', 'fullName'] }],
      limit: Number(limit),
      offset: Number(offset),
      order: [['createdAt', 'DESC']]
    });

    const reels = await Reel.findAll({
      where: {
        [Op.or]: [
          { userId: { [Op.in]: followedIds } },
          { visibility: 'public' }
        ]
      },
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatar', 'fullName'] }],
      limit: 6,
      order: [['createdAt', 'DESC']]
    });

    res.json({ posts, reels, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const items = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 30
    });
    res.json({ notifications: items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  searchUsers,
  getProfile,
  updateProfile,
  toggleFollow,
  handleFollowRequest,
  listFollowRequests,
  getSuggestedUsers,
  getFeed,
  getNotifications
};
