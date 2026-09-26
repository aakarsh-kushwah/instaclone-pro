import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Reel = sequelize.define('Reel', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' } },
  caption: { type: DataTypes.TEXT },
  video: { type: DataTypes.STRING(500), allowNull: false },
  thumbnail: { type: DataTypes.STRING(500) },
  music: { type: DataTypes.STRING(500) },
  musicName: { type: DataTypes.STRING(255) },
  musicArtist: { type: DataTypes.STRING(255) },
  duration: { type: DataTypes.INTEGER },
  likes: { type: DataTypes.INTEGER, defaultValue: 0 },
  comments: { type: DataTypes.INTEGER, defaultValue: 0 },
  shares: { type: DataTypes.INTEGER, defaultValue: 0 },
  views: { type: DataTypes.INTEGER, defaultValue: 0 },
  saves: { type: DataTypes.INTEGER, defaultValue: 0 },
  hashtags: { type: DataTypes.JSON, defaultValue: [] },
  mentions: { type: DataTypes.JSON, defaultValue: [] },
  visibility: { type: DataTypes.ENUM('public', 'followers', 'private'), defaultValue: 'public' }
}, { timestamps: true });

Reel.belongsTo(User, { foreignKey: 'userId', as: 'author' });

export default Reel;
