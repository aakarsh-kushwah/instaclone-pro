import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Block = sequelize.define('Block', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  blockerId: { type: DataTypes.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' } },
  blockedId: { type: DataTypes.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' } },
  reason: { type: DataTypes.STRING(255) }
}, { timestamps: true });

export default Block;
