const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return ChatRoomInvited.init(sequelize, DataTypes);
}

class ChatRoomInvited extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    phonenumber: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    chat_room_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'chat_room',
        key: 'id'
      }
    },
    invited_by_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'chat_room_invited',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "chat_room_invited_group_chat_id_3c385a1f",
        fields: [
          { name: "chat_room_id" },
        ]
      },
      {
        name: "chat_room_invited_invited_by_id_cad2ed38",
        fields: [
          { name: "invited_by_id" },
        ]
      },
      {
        name: "chat_room_invited_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
