"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Banners", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title_tm: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      title_ru: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      title_en: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      text_tm: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      text_ru: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      text_en: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      link: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      img: {
        type: Sequelize.STRING,
      },
      type: { allowNull: false, defaultValue: "1", type: Sequelize.STRING },
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
    await queryInterface.dropTable("Banners");
  },
};
