import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Bookmark = sequelize.define('Bookmark', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' } },
  postId: { type: DataTypes.BIGINT, references: { model: 'Posts', key: 'id' } },
  reelId: { type: DataTypes.BIGINT, references: { model: 'Reels', key: 'id' } },
  collectionName: { type: DataTypes.STRING(255) }
}, { timestamps: true });

export default Bookmark;
