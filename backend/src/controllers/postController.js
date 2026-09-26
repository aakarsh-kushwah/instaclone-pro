import { db } from '../config/db.js';

export const createPost = async (req, res) => {
  try {
    const { caption, imageUrl } = req.body;
    const [result] = await db.query(
      'INSERT INTO posts (user_id, caption, image_url, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [req.user.id, caption || '', imageUrl || '',]
    );

    return res.status(201).json({ id: result.insertId, message: 'Post created successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create post', error: error.message });
  }
};

export const getFeed = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, u.username, u.avatar, u.full_name,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS likes_count,
        (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) AS comments_count
      FROM posts p
      JOIN users u ON u.id = p.user_id
      ORDER BY p.created_at DESC
      LIMIT 20
    `);

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch feed', error: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await db.query(`
      SELECT p.*, u.username, u.avatar,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS likes_count,
        (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) AS comments_count
      FROM posts p
      JOIN users u ON u.id = p.user_id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `, [userId]);

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch user posts', error: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await db.query('SELECT * FROM post_likes WHERE post_id = ? AND user_id = ?', [id, req.user.id]);

    if (existing.length) {
      await db.query('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?', [id, req.user.id]);
      return res.json({ liked: false });
    }

    await db.query('INSERT INTO post_likes (post_id, user_id, created_at) VALUES (?, ?, NOW())', [id, req.user.id]);
    return res.json({ liked: true });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to like post', error: error.message });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    await db.query('INSERT INTO post_comments (post_id, user_id, text, created_at) VALUES (?, ?, ?, NOW())', [id, req.user.id, text]);
    return res.status(201).json({ message: 'Comment added successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to add comment', error: error.message });
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await db.query('SELECT * FROM bookmarks WHERE user_id = ? AND post_id = ?', [req.user.id, id]);

    if (existing.length) {
      await db.query('DELETE FROM bookmarks WHERE user_id = ? AND post_id = ?', [req.user.id, id]);
      return res.json({ bookmarked: false });
    }

    await db.query('INSERT INTO bookmarks (user_id, post_id, created_at) VALUES (?, ?, NOW())', [req.user.id, id]);
    return res.json({ bookmarked: true });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to toggle bookmark', error: error.message });
  }
};
