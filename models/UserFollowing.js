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
      allowNull: false
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
      },
      unique: "user_followings_user_from_id_user_to_id_5409ae8f_uniq"
    },
    user_to_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      unique: "user_followings_user_from_id_user_to_id_5409ae8f_uniq"
    },
    is_blocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    is_muted: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    acceptedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejectedAt: {
      type: DataTypes.DATE,
      allowNull: true
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
        name: "user_followings_user_from_id_user_to_id_5409ae8f_uniq",
        unique: true,
        fields: [
          { name: "user_from_id" },
          { name: "user_to_id" },
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
