import { db } from '../config/db.js';

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    if (!receiverId || !text) {
      return res.status(400).json({ message: 'Receiver and text are required' });
    }

    const [result] = await db.query(
      'INSERT INTO messages (sender_id, receiver_id, text, created_at) VALUES (?, ?, ?, NOW())',
      [req.user.id, receiverId, text]
    );

    return res.status(201).json({ id: result.insertId, message: 'Message sent' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to send message', error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await db.query(
      `SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created_at ASC`,
      [req.user.id, userId, userId, req.user.id]
    );

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch messages', error: error.message });
  }
};
