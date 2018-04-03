module.exports = (sequelize, DataTypes) => {
  var FollowerFollowed = sequelize.define('FollowerFollowed', {
    friends: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    freezeTableName: true
  });

  return FollowerFollowed;
};