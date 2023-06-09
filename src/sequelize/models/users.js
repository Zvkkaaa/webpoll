const DataTypes = require("sequelize");
const db = require("../../services/database");

const Users = db.define(
  "users",
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

    username: {
      type: DataTypes.STRING,
    },

    email: {
      type: DataTypes.STRING,
    },
    birthdate: {
      type: DataTypes.DATE,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "User",
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

module.exports = Users;
