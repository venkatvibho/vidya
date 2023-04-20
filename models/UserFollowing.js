const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return UserFollowing.init(sequelize, DataTypes);
}

class UserFollowing extends Sequelize.Model {
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
    is_slambook_skip: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    slam_book_skip_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    user_from_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    user_to_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'user_followings',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "user_followings_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "user_followings_user_from_id_b74a89db",
        fields: [
          { name: "user_from_id" },
        ]
      },
      {
        name: "user_followings_user_to_id_cff4bfde",
        fields: [
          { name: "user_to_id" },
        ]
      },
    ]
  });
  }
}
