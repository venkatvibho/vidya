const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return ChatRoomHistoryViewed.init(sequelize, DataTypes);
}

class ChatRoomHistoryViewed extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    chat_room_history_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'chat_room_history',
        key: 'id'
      },
      unique: "chat_room_history_viewed_chat_room_history_id_use_a34ec21f_uniq"
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      unique: "chat_room_history_viewed_chat_room_history_id_use_a34ec21f_uniq"
    },
    is_viewed: {
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
    }
  }, {
    sequelize,
    tableName: 'chat_room_history_viewed',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "chat_room_history_viewed_chat_room_history_id_b6d3838e",
        fields: [
          { name: "chat_room_history_id" },
        ]
      },
      {
        name: "chat_room_history_viewed_chat_room_history_id_use_a34ec21f_uniq",
        unique: true,
        fields: [
          { name: "chat_room_history_id" },
          { name: "user_id" },
        ]
      },
      {
        name: "chat_room_history_viewed_chatroom_id_caebef23",
        fields: [
          { name: "chatroom_id" },
        ]
      },
      {
        name: "chat_room_history_viewed_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "chat_room_history_viewed_user_id_d66eb3cf",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
