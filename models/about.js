'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class About extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  About.init({
    name_tm: DataTypes.STRING,
    name_ru: DataTypes.STRING,
    name_en: DataTypes.STRING,
    text_tm: DataTypes.TEXT,
    text_ru: DataTypes.TEXT,
    text_en: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'About',
  });
  return About;
};