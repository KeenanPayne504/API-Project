'use strict';
const bcrypt = require("bcryptjs");


module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        email: 'dimmadome@user.io',
        username: 'DimmsdaleDimmadome',
        hashedPassword: bcrypt.hashSync('tominotokatateke')
      },
      {
        email: 'shrinemaiden@gensou.io',
        username: 'CrimsonSlasher',
        hashedPassword: bcrypt.hashSync('hakureishrine')
      },
      {
        email: 'blackcat@yakumo.io',
        username: 'Cheeeen',
        hashedPassword: bcrypt.hashSync('blackcatofillomens')
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
