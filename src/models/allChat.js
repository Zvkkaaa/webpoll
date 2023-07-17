const { DataTypes, Model } = require('sequelize');
const db = require('../services/database');
const moment = require('moment');
const Users = require('./users');
class allChat extends Model {}

allChat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sender_name: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'username',
      },
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'allChat',
    freezeTableName: true,
    tableName: 'allChat',
  }
);
allChat.belongsTo(Users, {
    foreignKey: 'sender_name',
    targetKey: 'username',
    onDelete: 'CASCADE',
    onUpdate:'CASCADE'
  }); 
module.exports = allChat;
