const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return PostCommentReply.init(sequelize, DataTypes);
}

class PostCommentReply extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    replay_comment: {
      type: DataTypes.TEXT,
      allowNull: false
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
    tableName: 'post_comment_replies',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "post_comment_replies_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "post_comment_replies_postcomment_id_a8428ae9",
        fields: [
          { name: "postcomment_id" },
        ]
      },
      {
        name: "post_comment_replies_user_id_f2468448",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
