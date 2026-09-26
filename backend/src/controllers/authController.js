import bcrypt from 'bcryptjs';
import { db } from '../config/db.js';
import { signToken } from '../utils/jwt.js';

export const register = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email, and password are required' });
    }

    const [existing] = await db.query('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
    if (existing.length) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (username, email, password, full_name, avatar, bio, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [username, email, hashedPassword, fullName || '', 'https://picsum.photos/200', '',]
    );

    const user = {
      id: result.insertId,
      username,
      email,
      fullName: fullName || '',
      avatar: 'https://picsum.photos/200',
      bio: ''
    };

    return res.status(201).json({
      message: 'User created successfully',
      token: signToken(user),
      user
    });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      avatar: user.avatar,
      bio: user.bio
    };

    return res.json({ token: signToken(safeUser), user: safeUser });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

export const me = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      avatar: user.avatar,
      bio: user.bio
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch profile', error: error.message });
  }
};
