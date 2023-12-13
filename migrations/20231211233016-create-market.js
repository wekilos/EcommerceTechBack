"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Markets", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name_tm: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      name_ru: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      name_en: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
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
      address_tm: { allowNull: false, defaultValue: "", type: Sequelize.TEXT },
      address_ru: { allowNull: false, defaultValue: "", type: Sequelize.TEXT },
      address_en: { allowNull: false, defaultValue: "", type: Sequelize.TEXT },
      valyuta: { allowNull: false, defaultValue: 1, type: Sequelize.REAL },
      dastavka: { allowNull: false, defaultValue: 15, type: Sequelize.REAL },
      ex_dastavka: { allowNull: false, defaultValue: 20, type: Sequelize.REAL },
      phone: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      instagram: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      tiktok: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      telegram: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
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
    await queryInterface.dropTable("Markets");
  },
};
