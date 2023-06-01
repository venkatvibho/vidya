const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return UserPrivacySetting.init(sequelize, DataTypes);
}

class UserPrivacySetting extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    tag: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    connect: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    profile_lock: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    block_user: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    message: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    group_request: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    schedules: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    post_comments: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    reaction_pref: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    profile_info: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    review_taggings: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      unique: "user_privacy_settings_user_id_key"
    }
  }, {
    sequelize,
    tableName: 'user_privacy_settings',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "user_privacy_settings_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "user_privacy_settings_user_id_key",
        unique: true,
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
