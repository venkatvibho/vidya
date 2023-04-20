const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return PostUser.init(sequelize, DataTypes);
}

class PostUser extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    is_hide: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_save: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_viewed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_liked: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    post_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'posts',
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
    tableName: 'post_users',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "post_users_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "post_users_post_id_1a1aecfa",
        fields: [
          { name: "post_id" },
        ]
      },
      {
        name: "post_users_user_id_420265b6",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
