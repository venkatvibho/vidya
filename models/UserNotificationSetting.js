const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return UserNotificationSetting.init(sequelize, DataTypes);
}

class UserNotificationSetting extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    is_comments_on: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_share_on: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_tag_on: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_reminders_on: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_connect_request_on: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_group_form_request_on: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_activities_on: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_events_on: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_updates_from_friends_on: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      unique: "user_notification_settings_user_id_key"
    }
  }, {
    sequelize,
    tableName: 'user_notification_settings',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "user_notification_settings_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "user_notification_settings_user_id_key",
        unique: true,
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
