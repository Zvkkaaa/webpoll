const DataTypes = require("sequelize");
const db = require("../services/database");
const moment = require('moment')

const Comments = db.define(
  "comments",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    pollid: {
      type: DataTypes.INTEGER,
    },

    username: {
      type: DataTypes.STRING,
    },
    comment: {
      type: DataTypes.STRING,
    },
    posteddate: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue("createdAt")).format(
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
    freezeTableName: true,
  }
);

module.exports = Comments;
