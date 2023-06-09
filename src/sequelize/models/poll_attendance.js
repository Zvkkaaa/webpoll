'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class poll_attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
  poll_attendance.init({
    id:{
      type:DataTypes.INTEGER,
      primaryKey:true
    },
    pollid: DataTypes.INTEGER,
    userid: DataTypes.INTEGER,
    answerid: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'poll_attendance',
  });
  poll_attendance.associate = models => {
    poll_attendance.belongsTo(models.users,{
      foreignKey:'userid',
      onDelete:'CASCADE'
    });
    poll_attendance.belongsTo(models.polls,{
      foreignKey:'pollid',
      onDelete:'CASCADE'
    });
    poll_attendance.belongsTo(models.poll_answers,{
      foreignKey:'answerid',
      onDelete:'CASCADE'
    });
  }
  return poll_attendance;
};