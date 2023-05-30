const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return GroupChat.init(sequelize, DataTypes);
}

class GroupChat extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    replied_chat_room_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    group_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
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
    },
    send_type: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    is_image: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'group_chat',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "group_chat_group_id_0c64e889",
        fields: [
          { name: "group_id" },
        ]
      },
      {
        name: "group_chat_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "group_chat_user_id_ed639680",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
