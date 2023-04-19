const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return ChatRoom.init(sequelize, DataTypes);
}

class ChatRoom extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    participants: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false
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
    tableName: 'chat_room',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "chat_room_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "chat_room_user_id_0cd24bcd",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
