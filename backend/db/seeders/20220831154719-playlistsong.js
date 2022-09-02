'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('PlaylistSongs', [
      {
        songId: 1,
        playlistId: 1,
        order: 1
      },
      {
        songId: 2,
        playlistId: 2,
        order: 2
      },
      {
        songId: 3,
        playlistId: 3,
        order: 3
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete("PlaylistSongs", null, {});
  },
};
