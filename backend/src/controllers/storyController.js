import { db } from '../config/db.js';

export const createStory = async (req, res) => {
  try {
    const { mediaUrl, caption } = req.body;
    if (!mediaUrl) {
      return res.status(400).json({ message: 'Media URL is required' });
    }

    const [result] = await db.query(
      'INSERT INTO stories (user_id, media_url, caption, created_at, expires_at) VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 24 HOUR))',
      [req.user.id, mediaUrl, caption || '']
    );

    return res.status(201).json({ id: result.insertId, message: 'Story created' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create story', error: error.message });
  }
};

export const getStories = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, u.username, u.avatar
      FROM stories s
      JOIN users u ON u.id = s.user_id
      WHERE s.expires_at > NOW()
      ORDER BY s.created_at DESC
    `);

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch stories', error: error.message });
  }
};
