const DataTypes = require("sequelize");
const db = require("../services/database");

const PollAttendance = db.define(
  "poll_attendances",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    pollid: {
      type: DataTypes.INTEGER,
    },

    userid: {
      type: DataTypes.INTEGER,
    },
    answerid: {
      type: DataTypes.INTEGER,
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
    freezeTableName: true,
  }
);

module.exports = PollAttendance;
