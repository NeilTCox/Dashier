module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define('Post', {
      sender: {
        type: DataTypes.STRING
      },
      amount: {
        type: DataTypes.FLOAT
      },
      recipient: {
        type: DataTypes.STRING
      },
      message: {
        type: DataTypes.STRING
      },
      likes: {
        type: DataTypes.ARRAY(DataTypes.STRING)
      }
    }
    /*, {
        freezeTableName: true
      }*/
  );

  return Post;
};