'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Playlists', [
      {
        userId: 1,
        name: "Touhou Arranges",
        imageUrl: "www.thisplaylistart.com"
      },
      {
        userId: 2,
        name: "Touhou Arranges2",
        imageUrl: "www.thisplaylistart2.com"
      },
      {
        userId: 3,
        name: "Touhou Arranges3",
        imageUrl: "www.thisplaylistart3.com"
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete("Playlists", null, {});
  },
};
