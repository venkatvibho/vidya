const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return GroupChatViewed.init(sequelize, DataTypes);
}

class GroupChatViewed extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    group_chat_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'group_chat',
        key: 'id'
      },
      unique: "group_chat_viewed_group_chat_id_user_id_3054e193_uniq"
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      unique: "group_chat_viewed_group_chat_id_user_id_3054e193_uniq"
    }
  }, {
    sequelize,
    tableName: 'group_chat_viewed',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "group_chat_viewed_group_chat_id_68e85cda",
        fields: [
          { name: "group_chat_id" },
        ]
      },
      {
        name: "group_chat_viewed_group_chat_id_user_id_3054e193_uniq",
        unique: true,
        fields: [
          { name: "group_chat_id" },
          { name: "user_id" },
        ]
      },
      {
        name: "group_chat_viewed_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "group_chat_viewed_user_id_8d183eb0",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
