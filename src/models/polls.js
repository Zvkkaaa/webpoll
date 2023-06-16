  const DataTypes = require("sequelize");
  const db = require("../services/database");
  const moment = require('moment');

  const Polls = db.define(
    "polls",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
      },
      question: {
        type: DataTypes.STRING,
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
      freezeTableName: true,
    }
  );

  module.exports = Polls;
