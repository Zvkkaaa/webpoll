const { DataTypes, Model } = require("sequelize");
const db = require("../services/database");
const moment = require('moment');
const Users = require('./users');
const Polls = require('./polls');

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pollid: {
      type: DataTypes.INTEGER,
      references: {
        model: Polls,
        key: 'id'
      },
    },
    username: {
      type: DataTypes.STRING,
      references: {
        model: Users,
        key: 'username'
      },
    },
    comment: {
      type: DataTypes.STRING,
    },
    posteddate: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue("posteddate")).format(
          "YYYY/MM/DD HH:mm"
        );
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue("createdAt")).format(
          "YYYY/MM/DD HH:mm"
        );
      },
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: db,
    modelName: 'comments',
    tableName: 'comments', // Added tableName property
    freezeTableName: true,
  }
);

Comment.belongsTo(Users, {
  foreignKey: 'username',
  targetKey: 'username',
  onDelete: 'CASCADE',
});

Comment.belongsTo(Polls, {
  foreignKey: 'pollid',
  targetKey: 'id',
  onDelete: 'CASCADE',
});

module.exports = Comment;
