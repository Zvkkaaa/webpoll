const { DataTypes, Model } = require('sequelize');
const db = require('../services/database');
const moment = require('moment');
const Users = require('./users');
class ChatMessage extends Model {}

ChatMessage.init(
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
    recipient_id: {
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
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  },
  {
    sequelize: db,
    modelName: 'chat_message',
    freezeTableName: true,
    tableName: 'chat_message',
  }
);
ChatMessage.belongsTo(Users, {
    foreignKey: 'sender_id',
    targetKey: 'id',
    onDelete: 'CASCADE',
    onUpdate:'CASCADE'
  });
  ChatMessage.belongsTo(Users, {
    foreignKey: 'recipient_id',
    targetKey: 'id',
    onDelete: 'CASCADE',
    onUpdate:'CASCADE'
  });
module.exports = ChatMessage;
