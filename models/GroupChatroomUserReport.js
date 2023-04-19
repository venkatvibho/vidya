const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return GroupChatroomUserReport.init(sequelize, DataTypes);
}

class GroupChatroomUserReport extends Sequelize.Model {
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
    group_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'groups',
        key: 'id'
      }
    },
    reported_user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'group_chatroom_user_reports',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "group_chatroom_user_reports_group_id_7d976a20",
        fields: [
          { name: "group_id" },
        ]
      },
      {
        name: "group_chatroom_user_reports_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "group_chatroom_user_reports_reported_user_id_c4afd66e",
        fields: [
          { name: "reported_user_id" },
        ]
      },
    ]
  });
  }
}
