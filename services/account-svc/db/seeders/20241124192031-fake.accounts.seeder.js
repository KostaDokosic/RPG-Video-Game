'use strict';
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const roles = ['user', 'admin', 'moderator'];
    const accounts = [];

    for (let i = 0; i < 10; i++) {
      const name = faker.internet.username();
      const password = await bcrypt.hash(faker.internet.password(8), 10);
      const role = roles[Math.floor(Math.random() * roles.length)];

      accounts.push({
        name,
        password,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
    }

    await queryInterface.bulkInsert('users', accounts);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      'users',
      { role: { [Sequelize.Op.in]: ['user', 'admin', 'moderator'] } },
      {}
    );
  },
};
