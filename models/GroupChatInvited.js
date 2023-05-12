const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return GroupChatInvited.init(sequelize, DataTypes);
}

class GroupChatInvited extends Sequelize.Model {
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
    invited_by_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    group_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'groups',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'group_chat_invited',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "group_chat_invited_group_id_737debfb",
        fields: [
          { name: "group_id" },
        ]
      },
      {
        name: "group_chat_invited_invited_by_id_6532af05",
        fields: [
          { name: "invited_by_id" },
        ]
      },
      {
        name: "group_chat_invited_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
