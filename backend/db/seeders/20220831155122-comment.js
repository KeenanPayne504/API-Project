'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Comments', [
      {
        songId: 1,
        userId: 1,
        body: "This is my favorite circle"
      },
      {
        songId: 1,
        userId: 2,
        body: "This is my favorite circle2"
      },
      {
        songId: 1,
        userId: 3,
        body: "This is my favorite circle3"
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete("Comments", null, {});
  },
};
