import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(100), unique: true, allowNull: false },
  email: { type: DataTypes.STRING(255), unique: true, allowNull: false },
  password: { type: DataTypes.STRING(255), allowNull: false },
  fullName: { type: DataTypes.STRING(255) },
  bio: { type: DataTypes.TEXT },
  avatar: { type: DataTypes.STRING(500), defaultValue: 'https://via.placeholder.com/150' },
  website: { type: DataTypes.STRING(255) },
  gender: { type: DataTypes.ENUM('male', 'female', 'other') },
  isPrivate: { type: DataTypes.BOOLEAN, defaultValue: false },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  followers: { type: DataTypes.INTEGER, defaultValue: 0 },
  following: { type: DataTypes.INTEGER, defaultValue: 0 },
  postsCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  reelsCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  storiesCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  lastOnline: { type: DataTypes.DATE },
  twoFactorEnabled: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { timestamps: true });

export default User;
