"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Records", "userId", {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Records", "userId", {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
    });
  },
};
