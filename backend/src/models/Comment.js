import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Comment = sequelize.define('Comment', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' } },
  postId: { type: DataTypes.BIGINT, references: { model: 'Posts', key: 'id' } },
  reelId: { type: DataTypes.BIGINT, references: { model: 'Reels', key: 'id' } },
  parentCommentId: { type: DataTypes.BIGINT, references: { model: 'Comments', key: 'id' } },
  text: { type: DataTypes.TEXT, allowNull: false },
  likes: { type: DataTypes.INTEGER, defaultValue: 0 },
  mentions: { type: DataTypes.JSON, defaultValue: [] }
}, { timestamps: true });

Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });
Comment.hasMany(Comment, { foreignKey: 'parentCommentId', as: 'replies' });

export default Comment;
