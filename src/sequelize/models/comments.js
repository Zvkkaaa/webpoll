'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  comments.init({
    id:{
      type:DataTypes.INTEGER,
      primaryKey:true
    },
    pollid: DataTypes.INTEGER,
    userid: {
      type:DataTypes.INTEGER,
      allowNull:true},
    comment: DataTypes.STRING,
    posteddate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'comments',
  });
  comments.associate = models =>{
    comments.belongsTo(models.users,{
      foreignKey:'userid',
      onDelete:'SET NULL'
    });
    comments.belongsTo(models.polls,{
      foreignKey:'pollid',
      onDelete:'CASCADE'
    })
  }
  return comments;
};