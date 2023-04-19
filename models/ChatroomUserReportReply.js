const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return ChatroomUserReportReply.init(sequelize, DataTypes);
}

class ChatroomUserReportReply extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    chatroomreport_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'chatroom_user_reports',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'chatroom_user_report_replies',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "chatroom_user_report_replies_chatroomreport_id_ec755601",
        fields: [
          { name: "chatroomreport_id" },
        ]
      },
      {
        name: "chatroom_user_report_replies_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
