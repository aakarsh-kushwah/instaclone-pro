import { db } from '../config/db.js';

export const search = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const keyword = `%${q}%`;

    const [users] = await db.query(
      'SELECT id, username, full_name, avatar FROM users WHERE username LIKE ? OR full_name LIKE ? LIMIT 10',
      [keyword, keyword]
    );

    const [posts] = await db.query(
      'SELECT * FROM posts WHERE caption LIKE ? LIMIT 10',
      [keyword]
    );

    return res.json({ users, posts });
  } catch (error) {
    return res.status(500).json({ message: 'Search failed', error: error.message });
  }
};

export const trendingTags = async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT tag, COUNT(*) AS count FROM hashtags GROUP BY tag ORDER BY count DESC LIMIT 10');
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch tags', error: error.message });
  }
};
