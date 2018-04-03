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
  });

  User.belongsToMany(User, {
    as: 'followed',
    through: 'FollowerFollowed',
    foreignKey: 'follower'
  });

  User.belongsToMany(User, {
    as: 'follower',
    through: 'FollowerFollowed',
    foreignKey: 'followed'
  });

  User.hashPassword = function(password) {
    return bcrypt.hashSync(password, 10);
  };

  return User;
};