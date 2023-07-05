const { DataTypes, Model } = require("sequelize");
const db = require("../services/database");
const moment = require('moment');
const Users = require('./users');

class Polls extends Model {}

Polls.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      references: {
        model: Users,
        key: 'username'
      },
    },
    question: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    visibility: {
      type: DataTypes.BOOLEAN,
    },
    startdate: {
      type: DataTypes.DATE,
    },
    expiredate: {
      type: DataTypes.DATE,
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
    modelName: 'polls',
    tableName: 'polls', // Added tableName property
    freezeTableName: true,
  }
);

Polls.belongsTo(Users, {
  foreignKey: 'username',
  targetKey: 'username',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

module.exports = Polls;
