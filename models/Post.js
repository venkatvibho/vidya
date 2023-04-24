const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Post.init(sequelize, DataTypes);
}

class Post extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    type_of_activity: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    activity_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'activities',
        key: 'id'
      }
    },
    group_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'groups',
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
    tableName: 'posts',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "posts_activity_id_33320e68",
        fields: [
          { name: "activity_id" },
        ]
      },
      {
        name: "posts_group_id_18217baf",
        fields: [
          { name: "group_id" },
        ]
      },
      {
        name: "posts_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "posts_user_id_4291758d",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
