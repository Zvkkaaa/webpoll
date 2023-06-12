const DataTypes = require("sequelize");
const db = require("../services/database");

const PollAnswer = db.define(
  "poll_answers",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pollid:{
        type: DataTypes.INTEGER,
    },
    answername: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      get(){
        return moment(this.getDataValue("createdAt")).format("YYYY/MM/DD HH:mm")
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = PollAnswer;