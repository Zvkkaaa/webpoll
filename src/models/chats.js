const { DataTypes, Model } = require('sequelize');
const db = require('../services/database');
const moment = require('moment');
const Users = require('./users');

class Chats extends Model {}

Chats.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Users,
        key: 'id',
      },
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: 'Chats',
    freezeTableName: true,
    tableName: 'chats',
  }
);

Chats.belongsTo(Users, {
  foreignKey: 'sender_id',
  targetKey: 'id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

module.exports = Chats;
