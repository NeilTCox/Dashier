'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      sender: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.FLOAT
      },
      recipient: {
        type: Sequelize.STRING
      },
      message: {
        type: Sequelize.STRING
      },
      likes: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};