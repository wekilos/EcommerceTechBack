'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Question.init({
    name_tm: DataTypes.TEXT,
    name_ru: DataTypes.TEXT,
    name_en: DataTypes.TEXT,
    text_tm: DataTypes.TEXT,
    text_ru: DataTypes.TEXT,
    text_en: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};