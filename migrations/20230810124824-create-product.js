"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name_tm: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      name_ru: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      name_en: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      color_tm: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      color_ru: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      color_en: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      description_tm: {
        allowNull: false,
        defaultValue: "",
        type: Sequelize.TEXT,
      },
      description_ru: {
        allowNull: false,
        defaultValue: "",
        type: Sequelize.TEXT,
      },
      description_en: {
        allowNull: false,
        defaultValue: "",
        type: Sequelize.TEXT,
      },
      bar_code: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      price: { allowNull: false, defaultValue: 0, type: Sequelize.REAL },
      discount_price: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.REAL,
      },
      is_discount: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      usd_price: { allowNull: false, defaultValue: 0, type: Sequelize.REAL },
      usd_price_discount: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.REAL,
      },
      is_valyuta: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      discount: { allowNull: false, defaultValue: 0, type: Sequelize.REAL },
      stock: { allowNull: false, defaultValue: 0, type: Sequelize.INTEGER },
      is_moresale: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      is_new: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      is_selected: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      link: {
        allowNull: false,
        defaultValue: "",
        type: Sequelize.TEXT,
      },

      CategoryId: {
        type: Sequelize.INTEGER,
      },
      BrandId: {
        type: Sequelize.INTEGER,
      },
      orderNum: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      active: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      deleted: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Products");
  },
};
