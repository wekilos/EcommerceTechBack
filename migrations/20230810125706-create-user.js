"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: { allowNull: false, defaultValue: "user", type: Sequelize.STRING },
      lastname: {
        allowNull: false,
        defaultValue: "",
        type: Sequelize.STRING,
      },
      phone: {
        allowNull: false,
        require,
        type: Sequelize.STRING,
      },
      password: { allowNull: false, defaultValue: "", type: Sequelize.TEXT },
      address: { allowNull: false, defaultValue: "", type: Sequelize.TEXT },
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
    await queryInterface.dropTable("Users");
  },
};
