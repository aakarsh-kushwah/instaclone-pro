import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Story = sequelize.define('Story', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' } },
  media: { type: DataTypes.STRING(500), allowNull: false },
  mediaType: { type: DataTypes.ENUM('image', 'video'), defaultValue: 'image' },
  caption: { type: DataTypes.TEXT },
  music: { type: DataTypes.STRING(500) },
  musicName: { type: DataTypes.STRING(255) },
  musicArtist: { type: DataTypes.STRING(255) },
  stickers: { type: DataTypes.JSON, defaultValue: [] },
  filters: { type: DataTypes.JSON, defaultValue: {} },
  mentions: { type: DataTypes.JSON, defaultValue: [] },
  hashtags: { type: DataTypes.JSON, defaultValue: [] },
  views: { type: DataTypes.INTEGER, defaultValue: 0 },
  expiresAt: { type: DataTypes.DATE },
  allowReply: { type: DataTypes.BOOLEAN, defaultValue: true },
  allowShare: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { timestamps: true });

Story.belongsTo(User, { foreignKey: 'userId', as: 'author' });

export default Story;
