"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Albums",
      [
        {
          userId: 1,
          title: "Ama",
          description: "touhou",
          imageUrl: "thisalbum.com",
        },
        {
          userId: 2,
          title: "Amaa",
          description: "touhouu",
          imageUrl: "thisalbuum.com",
        },
        {
          userId: 3,
          title: "Amaaa",
          description: "touhouuu",
          imageUrl: "thisalbuuum.com",
        },
      ],
      {}
    );
  },
  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete("Albums", null, {});
  },
};
