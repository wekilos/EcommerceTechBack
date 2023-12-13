"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ComparePro extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ComparePro.belongsTo(models.Product);
      ComparePro.belongsTo(models.Compare);
    }
  }
  ComparePro.init(
    {
      orderNum: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ComparePro",
    }
  );
  return ComparePro;
};
