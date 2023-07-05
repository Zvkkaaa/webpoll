const { DataTypes, Model } = require("sequelize");
const db = require("../services/database");
const moment = require('moment');
const Polls = require('./polls');
const Users = require('./users');
const PollAnswer = require('./poll_answer');

class PollAttendance extends Model {}

PollAttendance.init(
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
    userid: {
      type: DataTypes.INTEGER,
      references: {
        model: Users,
        key: 'id'
      },
    },
    answerid: {
      type: DataTypes.INTEGER,
      references: {
        model: PollAnswer,
        key: 'id'
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
    modelName: 'poll_attendances',
    tableName: 'poll_attendances', // Added tableName property
    freezeTableName: true,
  }
);

PollAttendance.belongsTo(Polls, {
  foreignKey: 'pollid',
  targetKey:'id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

PollAttendance.belongsTo(Users, {
  foreignKey: 'userid',
  targetKey:'id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

PollAttendance.belongsTo(PollAnswer, {
  foreignKey: 'answerid',
  targetKey:'id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

module.exports = PollAttendance;
