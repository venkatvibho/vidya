const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return ChatRoomParticipant.init(sequelize, DataTypes);
}

class ChatRoomParticipant extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    chatroom_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'chat_room',
        key: 'id'
      },
      unique: "chat_room_participants_chatroom_id_user_id_02ffaf48_uniq"
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      unique: "chat_room_participants_chatroom_id_user_id_02ffaf48_uniq"
    }
  }, {
    sequelize,
    tableName: 'chat_room_participants',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "chat_room_participants_chatroom_id_1d18a761",
        fields: [
          { name: "chatroom_id" },
        ]
      },
      {
        name: "chat_room_participants_chatroom_id_user_id_02ffaf48_uniq",
        unique: true,
        fields: [
          { name: "chatroom_id" },
          { name: "user_id" },
        ]
      },
      {
        name: "chat_room_participants_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "chat_room_participants_user_id_e1e48324",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
