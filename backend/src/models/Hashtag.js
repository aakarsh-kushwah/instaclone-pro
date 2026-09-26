import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Hashtag = sequelize.define('Hashtag', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  tag: { type: DataTypes.STRING(255), unique: true, allowNull: false },
  usedCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  lastUsed: { type: DataTypes.DATE },
  description: { type: DataTypes.TEXT }
}, { timestamps: true });

export default Hashtag;
