'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Albums', [
      {
        title: "Salvage Dancehall",
        description: "latest disco album by Alstroemeria"
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete("Albums", null, {});
  },
};
