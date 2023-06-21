const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return PostCommentReplayLike.init(sequelize, DataTypes);
}

class PostCommentReplayLike extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    postcommentreplay_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'post_comment_replies',
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
    tableName: 'post_comment_replay_likes',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "post_comment_replay_likes_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "post_comment_replay_likes_postcommentreplay_id_37368dec",
        fields: [
          { name: "postcommentreplay_id" },
        ]
      },
      {
        name: "post_comment_replay_likes_user_id_295292f4",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
