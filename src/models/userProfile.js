const DataTypes = require("sequelize");
const db = require("../services/database");
const moment = require('moment');

const userProfile = db.define(
  "userProfile",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    userid: {
      type: DataTypes.INTEGER,
    },
    filename:{
      type: DataTypes.STRING,
    },
    path:{
      type:DataTypes.STRING,
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

module.exports = userProfile;
