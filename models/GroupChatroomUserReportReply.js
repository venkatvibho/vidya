const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return GroupChatroomUserReportReply.init(sequelize, DataTypes);
}

class GroupChatroomUserReportReply extends Sequelize.Model {
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
    group_chat_report_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'group_chatroom_user_reports',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'group_chatroom_user_report_replies',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "group_chatroom_user_report_group_chat_report_id_ff55d4fa",
        fields: [
          { name: "group_chat_report_id" },
        ]
      },
      {
        name: "group_chatroom_user_report_replies_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
