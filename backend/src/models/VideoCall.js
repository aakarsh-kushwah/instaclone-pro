import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const VideoCall = sequelize.define('VideoCall', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  callerId: { type: DataTypes.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' } },
  receiverId: { type: DataTypes.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' } },
  roomId: { type: DataTypes.STRING(255), unique: true },
  status: { type: DataTypes.ENUM('ringing', 'ongoing', 'ended', 'missed', 'declined'), defaultValue: 'ringing' },
  callType: { type: DataTypes.ENUM('audio', 'video'), defaultValue: 'video' },
  duration: { type: DataTypes.INTEGER, defaultValue: 0 },
  startedAt: { type: DataTypes.DATE },
  endedAt: { type: DataTypes.DATE }
}, { timestamps: true });

export default VideoCall;
