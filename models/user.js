var bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
      username: {
        type: DataTypes.STRING,
        unique: true
      },
      password: {
        type: DataTypes.STRING
      },
      balance: {
        type: DataTypes.FLOAT
      },
      // dashaddress: {
      //   type: DataTypes.STRING
      // },
      // privatekey: {
      //   type: DataTypes.STRING
      // },
      friends: {
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
      following: {
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('NOW()'),
      }
    }
    /*, {
        freezeTableName: true
      }*/
  );

  User.hashPassword = function(password) {
    return bcrypt.hashSync(password, 10);
  };

  return User;
};