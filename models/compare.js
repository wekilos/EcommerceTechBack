"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Compare extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Compare.hasMany(models.ComparePro);
    }
  }
  Compare.init(
    {
      orderNum: DataTypes.INTEGER,
      name_tm: DataTypes.STRING,
      name_ru: DataTypes.STRING,
      name_en: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Compare",
    }
  );
  return Compare;
};
