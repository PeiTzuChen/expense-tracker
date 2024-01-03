"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
     
    try {
      const password = await bcrypt.hash("123456Ab", 10);
      await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.bulkInsert(
          "Users",
          [
            {
              id: 1,
              name: "user1",
              email: "user1@example.com",
              password,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          { t }
        );

        await queryInterface.bulkInsert(
          "Records",
          [
            {
              id: 1,
              name: "加油",
              date: '2024-01-10',
              amount: 85,
              categoryId: 2,
              userId: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          { t }
        );
      });
    } catch (error) {
      throw new Error("failed");
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.bulkDelete("Users", null, { t });
        await queryInterface.bulkDelete("Records", null, { t });
      });
    } catch (error) {
      throw new Error("failed");
    }
  },
};
