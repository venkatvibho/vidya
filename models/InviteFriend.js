const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return InviteFriend.init(sequelize, DataTypes);
}

class InviteFriend extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    invite_type: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: "invite_friends_user_id_invite_type_invi_f9881d60_uniq"
    },
    invite_to_number_or_id: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: "invite_friends_user_id_invite_type_invi_f9881d60_uniq"
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      unique: "invite_friends_user_id_invite_type_invi_f9881d60_uniq"
    }
  }, {
    sequelize,
    tableName: 'invite_friends',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "invite_friends_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "invite_friends_user_id_95f01047",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "invite_friends_user_id_invite_type_invi_f9881d60_uniq",
        unique: true,
        fields: [
          { name: "user_id" },
          { name: "invite_type" },
          { name: "invite_to_number_or_id" },
        ]
      },
    ]
  });
  }
}
