import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Message = sequelize.define('Message', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  senderId: { type: DataTypes.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' } },
  receiverId: { type: DataTypes.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' } },
  text: { type: DataTypes.TEXT },
  image: { type: DataTypes.STRING(500) },
  video: { type: DataTypes.STRING(500) },
  audio: { type: DataTypes.STRING(500) },
  reaction: { type: DataTypes.STRING(50) },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  isSeen: { type: DataTypes.BOOLEAN, defaultValue: false },
  seenAt: { type: DataTypes.DATE },
  readAt: { type: DataTypes.DATE }
}, { timestamps: true });

Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

export default Message;
