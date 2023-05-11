const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return ChatRoomHistory.init(sequelize, DataTypes);
}

class ChatRoomHistory extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    replied_chat_room_history_id: {
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
    chatroom_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'chat_room',
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
    is_viewed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    send_type: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'chat_room_history',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "chat_room_history_chatroom_id_7c29bc51",
        fields: [
          { name: "chatroom_id" },
        ]
      },
      {
        name: "chat_room_history_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "chat_room_history_user_id_4b684bcb",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
