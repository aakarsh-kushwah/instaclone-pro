import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' } },
  fromUserId: { type: DataTypes.BIGINT, references: { model: 'Users', key: 'id' } },
  type: { type: DataTypes.ENUM('like', 'comment', 'follow', 'message', 'mention', 'tag', 'call'), allowNull: false },
  postId: { type: DataTypes.BIGINT, references: { model: 'Posts', key: 'id' } },
  reelId: { type: DataTypes.BIGINT, references: { model: 'Reels', key: 'id' } },
  title: { type: DataTypes.STRING(255) },
  message: { type: DataTypes.TEXT },
  image: { type: DataTypes.STRING(500) },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  readAt: { type: DataTypes.DATE },
  actionUrl: { type: DataTypes.STRING(500) }
}, { timestamps: true });

export default Notification;
