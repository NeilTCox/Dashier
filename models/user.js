module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
      username: {
        type: DataTypes.STRING,
        unique: true
      },
      password: {
        type: DataTypes.STRING
      },
      dashaddress: {
        type: DataTypes.STRING
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

  return User;
};