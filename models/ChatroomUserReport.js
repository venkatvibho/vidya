const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return ChatroomUserReport.init(sequelize, DataTypes);
}

class ChatroomUserReport extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
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
    tableName: 'chatroom_user_reports',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "chatroom_user_reports_chatroom_id_0c48dbd9",
        fields: [
          { name: "chatroom_id" },
        ]
      },
      {
        name: "chatroom_user_reports_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
