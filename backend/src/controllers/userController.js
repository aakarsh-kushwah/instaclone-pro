import { db } from '../config/db.js';

export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await db.query('SELECT id, username, email, full_name, avatar, bio, created_at FROM users WHERE id = ?', [id]);
    if (!users.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];
    const [followers] = await db.query('SELECT COUNT(*) AS count FROM follows WHERE following_id = ?', [id]);
    const [following] = await db.query('SELECT COUNT(*) AS count FROM follows WHERE follower_id = ?', [id]);

    return res.json({
      ...user,
      followers: followers[0]?.count || 0,
      following: following[0]?.count || 0
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch profile', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, avatar } = req.body;
    await db.query(
      'UPDATE users SET full_name = ?, bio = ?, avatar = ?, updated_at = NOW() WHERE id = ?',
      [fullName || '', bio || '', avatar || '', req.user.id]
    );

    return res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update profile', error: error.message });
  }
};

export const followUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (Number(id) === req.user.id) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const [rows] = await db.query('SELECT * FROM follows WHERE follower_id = ? AND following_id = ?', [req.user.id, id]);
    if (rows.length) {
      await db.query('DELETE FROM follows WHERE follower_id = ? AND following_id = ?', [req.user.id, id]);
      return res.json({ message: 'Unfollowed user', following: false });
    }

    await db.query('INSERT INTO follows (follower_id, following_id, created_at) VALUES (?, ?, NOW())', [req.user.id, id]);
    return res.json({ message: 'Followed user', following: true });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update follow state', error: error.message });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, username, full_name, avatar FROM users WHERE id != ? ORDER BY created_at DESC LIMIT 10',
      [req.user.id]
    );
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch suggestions', error: error.message });
  }
};
