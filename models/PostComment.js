const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return PostComment.init(sequelize, DataTypes);
}

class PostComment extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    postuser_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'post_users',
        key: 'id'
      }
    },
    post_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'post_comments',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "post_comments_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "post_comments_post_id_e17f8125",
        fields: [
          { name: "post_id" },
        ]
      },
      {
        name: "post_comments_postuser_id_6e5ba8b2",
        fields: [
          { name: "postuser_id" },
        ]
      },
    ]
  });
  }
}
