'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkDelete('users', { name: 'Administrator' }, {});
    const hashedPassword = await bcrypt.hash('adminAdmin123', 10);
    await queryInterface.bulkInsert('users', [
      {
        name: 'Administrator',
        role: 'gamemaster',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { name: 'Administrator' }, {});
  },
};
