import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Like = sequelize.define('Like', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' } },
  postId: { type: DataTypes.BIGINT, references: { model: 'Posts', key: 'id' } },
  reelId: { type: DataTypes.BIGINT, references: { model: 'Reels', key: 'id' } },
  commentId: { type: DataTypes.BIGINT, references: { model: 'Comments', key: 'id' } },
  type: { type: DataTypes.ENUM('like', 'love', 'haha', 'wow', 'sad', 'angry'), defaultValue: 'like' }
}, { timestamps: true });

Like.belongsTo(User, { foreignKey: 'userId' });

export default Like;
