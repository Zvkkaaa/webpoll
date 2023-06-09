const DataTypes = require("sequelize");
const db = require("../../services/database");

const Comments = db.define(
  "comments",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    commentid: {
      type: DataTypes.INTEGER,
    },

    pollid: {
      type: DataTypes.INTEGER,
    },

    userid: {
      type: DataTypes.INTEGER,
    },
    comment: {
      type: DataTypes.STRING,
    },
    posteddate: {
      type: DataTypes.DATE,
      get(){
        return moment(this.getDataValue("createdAt")).format("YYYY/MM/DD HH:mm")
      }
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

module.exports = Comments;
