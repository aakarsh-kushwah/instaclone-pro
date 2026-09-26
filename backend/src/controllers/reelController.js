import { db } from '../config/db.js';

export const createReel = async (req, res) => {
  try {
    const { caption, videoUrl } = req.body;
    if (!videoUrl) {
      return res.status(400).json({ message: 'Video URL is required' });
    }

    const [result] = await db.query(
      'INSERT INTO reels (user_id, caption, video_url, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [req.user.id, caption || '', videoUrl]
    );

    return res.status(201).json({ id: result.insertId, message: 'Reel created successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create reel', error: error.message });
  }
};

export const getReels = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.*, u.username, u.avatar,
        (SELECT COUNT(*) FROM reel_likes WHERE reel_id = r.id) AS likes_count,
        (SELECT COUNT(*) FROM reel_comments WHERE reel_id = r.id) AS comments_count
      FROM reels r
      JOIN users u ON u.id = r.user_id
      ORDER BY r.created_at DESC
    `);

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch reels', error: error.message });
  }
};

export const likeReel = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await db.query('SELECT * FROM reel_likes WHERE reel_id = ? AND user_id = ?', [id, req.user.id]);

    if (existing.length) {
      await db.query('DELETE FROM reel_likes WHERE reel_id = ? AND user_id = ?', [id, req.user.id]);
      return res.json({ liked: false });
    }

    await db.query('INSERT INTO reel_likes (reel_id, user_id, created_at) VALUES (?, ?, NOW())', [id, req.user.id]);
    return res.json({ liked: true });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to like reel', error: error.message });
  }
};

export const commentOnReel = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    await db.query('INSERT INTO reel_comments (reel_id, user_id, text, created_at) VALUES (?, ?, ?, NOW())', [id, req.user.id, text]);
    return res.status(201).json({ message: 'Reel comment added successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to add reel comment', error: error.message });
  }
};
