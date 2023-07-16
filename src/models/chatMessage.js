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
    sender_name: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'username',
      },
    },
    recipient_name: {
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
    sentdate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      get() {
        return moment(this.getDataValue('sent_date')).format('YYYY/MM/DD HH:mm');
      },
    },
  },
  {
    sequelize: db,
    modelName: 'chat_message',
    freezeTableName: true,
    tableName: 'chat_message',
  }
);
ChatMessage.belongsTo(Users, {
    foreignKey: 'sender_name',
    targetKey: 'username',
    onDelete: 'CASCADE',
    onUpdate:'CASCADE'
  });
  ChatMessage.belongsTo(Users, {
    foreignKey: 'recipient_name',
    targetKey: 'username',
    onDelete: 'CASCADE',
    onUpdate:'CASCADE'
  });
module.exports = ChatMessage;
