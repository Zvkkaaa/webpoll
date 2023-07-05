const { DataTypes, Model } = require("sequelize");
const db = require("../services/database");
const moment = require('moment');
const Polls = require('./polls');

class PollAnswer extends Model {}

PollAnswer.init(
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
    answername: {
      type: DataTypes.STRING,
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
    modelName: 'poll_answers',
    freezeTableName: true,
    tableName:'poll_answers',
  }
);

PollAnswer.belongsTo(Polls, {
  foreignKey: 'pollid',
  targetKey: 'id',
  onDelete: 'CASCADE',
});

module.exports = PollAnswer;
