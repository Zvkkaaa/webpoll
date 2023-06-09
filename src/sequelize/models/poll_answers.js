'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class poll_answers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  poll_answers.init({
    id:{
      type:DataTypes.INTEGER,
      primaryKey:true
    },
    pollid: DataTypes.INTEGER,
    answername: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'poll_answers',
  });
  poll_answers.associate = models => {
    poll_answers.belongsTo(models.polls,{
      foreignKey:'pollid',
      onDelete:'CASCADE'
    });
    poll_answers.hasMany(models.poll_attendance,{
      onDelete:'CASCADE',
      foreignKey:'answerid'
    });
  }
  return poll_answers;
};