module.exports = (sequelize, DataTypes) => {
  console.log('im in user model file');
  var User = sequelize.define('User', {
      username: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING
      },
      dashaddress: {
        type: DataTypes.STRING
      }
    }
    /*, {
        freezeTableName: true
      }*/
  );

  return User;
};