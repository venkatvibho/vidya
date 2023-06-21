const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return PostCommentLike.init(sequelize, DataTypes);
}

class PostCommentLike extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    postcomment_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'post_comments',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'post_comment_likes',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "post_comment_likes_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "post_comment_likes_postcomment_id_849e22d4",
        fields: [
          { name: "postcomment_id" },
        ]
      },
      {
        name: "post_comment_likes_user_id_57eb585b",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
