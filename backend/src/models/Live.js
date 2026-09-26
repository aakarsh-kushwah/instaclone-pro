import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Live = sequelize.define('Live', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' } },
  title: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT },
  thumbnail: { type: DataTypes.STRING(500) },
  roomId: { type: DataTypes.STRING(255), unique: true },
  streamUrl: { type: DataTypes.STRING(500) },
  status: { type: DataTypes.ENUM('scheduled', 'live', 'ended'), defaultValue: 'scheduled' },
  viewers: { type: DataTypes.INTEGER, defaultValue: 0 },
  likes: { type: DataTypes.INTEGER, defaultValue: 0 },
  comments: { type: DataTypes.INTEGER, defaultValue: 0 },
  duration: { type: DataTypes.INTEGER, defaultValue: 0 },
  startedAt: { type: DataTypes.DATE },
  endedAt: { type: DataTypes.DATE },
  visibility: { type: DataTypes.ENUM('public', 'followers', 'private'), defaultValue: 'public' }
}, { timestamps: true });

export default Live;
