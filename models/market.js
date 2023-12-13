"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Market extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Market.init(
    {
      name_tm: DataTypes.STRING,
      name_ru: DataTypes.STRING,
      name_en: DataTypes.STRING,
      description_tm: DataTypes.TEXT,
      description_ru: DataTypes.TEXT,
      description_en: DataTypes.TEXT,
      address_tm: DataTypes.TEXT,
      address_ru: DataTypes.TEXT,
      address_en: DataTypes.TEXT,
      valyuta: DataTypes.REAL,
      dastavka: DataTypes.REAL,
      ex_dastavka: DataTypes.REAL,
      phone: DataTypes.STRING,
      instagram: DataTypes.STRING,
      tiktok: DataTypes.STRING,
      telegram: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Market",
    }
  );
  return Market;
};
