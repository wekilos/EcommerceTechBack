"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.hasMany(models.ProductImg);
      Product.hasMany(models.ProductVideo);
      Product.belongsTo(models.Category);
      Product.belongsTo(models.Brand);
      Product.hasMany(models.ProductParametr);
      Product.hasMany(models.ComparePro);
      Product.hasMany(models.OrderProduct);
    }
  }
  Product.init(
    {
      name_tm: DataTypes.STRING,
      name_ru: DataTypes.STRING,
      name_en: DataTypes.STRING,
      color_tm: DataTypes.STRING,
      color_ru: DataTypes.STRING,
      color_en: DataTypes.STRING,
      description_tm: DataTypes.TEXT,
      description_ru: DataTypes.TEXT,
      description_en: DataTypes.TEXT,
      bar_code: DataTypes.STRING,
      price: DataTypes.REAL,
      came_price: DataTypes.REAL,
      discount_price: DataTypes.REAL,
      is_discount: DataTypes.BOOLEAN,
      usd_price: DataTypes.REAL,
      usd_price_discount: DataTypes.REAL,
      is_valyuta: DataTypes.BOOLEAN,
      discount: DataTypes.REAL,
      stock: DataTypes.INTEGER,
      watch_count: DataTypes.INTEGER,
      is_moresale: DataTypes.BOOLEAN,
      is_new: DataTypes.BOOLEAN,
      is_selected: DataTypes.BOOLEAN,
      link: DataTypes.TEXT,
      orderNum: DataTypes.INTEGER,
      active: DataTypes.BOOLEAN,
      deleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
