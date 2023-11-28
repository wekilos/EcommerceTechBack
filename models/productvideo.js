"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductVideo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProductVideo.belongsTo(models.Product);
    }
  }
  ProductVideo.init(
    {
      src: DataTypes.STRING,
      img: DataTypes.STRING,
      orderNum: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ProductVideo",
    }
  );
  return ProductVideo;
};
