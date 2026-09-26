import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Follow = sequelize.define('Follow', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  followerId: { type: DataTypes.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' } },
  followingId: { type: DataTypes.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' } },
  isClose: { type: DataTypes.BOOLEAN, defaultValue: false },
  isMuted: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { timestamps: true });

export default Follow;
