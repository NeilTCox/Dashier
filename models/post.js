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

  return Post;
};