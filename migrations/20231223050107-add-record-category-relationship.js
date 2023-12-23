'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addColumn("Records", "categoryId", {
     type: Sequelize.DataTypes.INTEGER,
     references: {
       model: "Categories", //
       key: "id",
     },
     onDelete: "SET NULL",
     onUpdate: "CASCADE",
   });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Records", "categoryId");
  }
};
