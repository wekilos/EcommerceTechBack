"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      lastname: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      phone: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      price: { allowNull: false, defaultValue: 0, type: Sequelize.REAL },
      discount_price: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.REAL,
      },
      delivery_price: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.REAL,
      },
      sum_price: { allowNull: false, defaultValue: 0, type: Sequelize.REAL },
      status: { allowNull: false, defaultValue: "1", type: Sequelize.STRING },
      code: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.STRING,
      },
      address: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      note: { allowNull: false, defaultValue: "", type: Sequelize.STRING },
      admin_note: {
        allowNull: false,
        defaultValue: "",
        type: Sequelize.STRING,
      },
      delivery_type: {
        allowNull: false,
        defaultValue: "",
        type: Sequelize.STRING,
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
    await queryInterface.dropTable("Orders");
  },
};
