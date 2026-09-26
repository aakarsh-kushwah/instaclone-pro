import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Post = sequelize.define('Post', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' } },
  caption: { type: DataTypes.TEXT },
  image: { type: DataTypes.STRING(500), allowNull: false },
  images: { type: DataTypes.JSON, defaultValue: [] },
  location: { type: DataTypes.STRING(255) },
  likes: { type: DataTypes.INTEGER, defaultValue: 0 },
  comments: { type: DataTypes.INTEGER, defaultValue: 0 },
  shares: { type: DataTypes.INTEGER, defaultValue: 0 },
  isCommentDisabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  isLikeHidden: { type: DataTypes.BOOLEAN, defaultValue: false },
  hashtags: { type: DataTypes.JSON, defaultValue: [] },
  mentions: { type: DataTypes.JSON, defaultValue: [] },
  visibility: { type: DataTypes.ENUM('public', 'followers', 'private'), defaultValue: 'public' },
  viewCount: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { timestamps: true });

Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });

export default Post;
