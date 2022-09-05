'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Songs', [
      {
        albumId: 1,
        userId: 1,
        title: "F.A.S.S.",
        description: "track from liquer n splash",
        url: "www.thissong.com",
        imageUrl: "www.thissongart.com"
      },
      {
        albumId: 2,
        userId: 2,
        title: "F.A.S.S.2",
        description: "track from liquer n splash2",
        url: "www.thissong2.com",
        imageUrl: "www.thissongart2.com"
      },
      {
        albumId: 3,
        userId: 3,
        title: "F.A.S.S.3",
        description: "track from liquer n splash3",
        url: "www.thissong3.com",
        imageUrl: "www.thissongart3.com"
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete("Songs", null, {});
  },
};
