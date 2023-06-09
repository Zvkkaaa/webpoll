'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class polls extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
  polls.init({
    id:{
      type:DataTypes.INTEGER,
      primaryKey:true
    },
    userid:{
      type:DataTypes.INTEGER,
      allowNull:true
    },
    question: DataTypes.STRING,
    startdate: DataTypes.DATE,
    expiredate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'polls',
  });
  polls.associate = models =>{
    polls.belongsTo(models.users,{
      foreignKey:'userid',
      onDelete:'SET NULL'
    });
    polls.hasMany(models.poll_answers,{
      onDelete:'CASCADE',
      foreignKey:'pollid'
    });
    polls.hasMany(models.poll_attendance,{
      onDelete:'CASCADE',
      foreignKey:'pollid'

    });
    polls.hasMany(models.comments,{
      onDelete:'CASCADE',
      pollid:'pollid'
    });
  }
  return polls;
};