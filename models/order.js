"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.hasMany(models.OrderProduct);
      Order.belongsTo(models.User);
    }
  }
  Order.init(
    {
      name: DataTypes.STRING,
      lastname: DataTypes.STRING,
      phone: DataTypes.STRING,
      price: DataTypes.REAL,
      discount_price: DataTypes.REAL,
      delivery_price: DataTypes.REAL,
      sum_price: DataTypes.REAL,
      status: DataTypes.STRING,
      code: DataTypes.STRING,
      address: DataTypes.STRING,
      note: DataTypes.STRING,
      admin_note: DataTypes.STRING,
      delivery_type: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
      deleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
