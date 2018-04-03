'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        type: Sequelize.STRING
      },
      balance: {
        type: Sequelize.FLOAT
      },
      // dashaddress: {
      //   type: Sequelize.STRING
      // },
      // privatekey: {
      //   type: Sequelize.STRING
      // },
      friends: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      following: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};