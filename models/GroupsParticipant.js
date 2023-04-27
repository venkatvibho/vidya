const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return GroupsParticipant.init(sequelize, DataTypes);
}

class GroupsParticipant extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    group_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'groups',
        key: 'id'
      },
      unique: "groups_participants_group_id_user_id_ccc2118b_uniq"
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      unique: "groups_participants_group_id_user_id_ccc2118b_uniq"
    }
  }, {
    sequelize,
    tableName: 'groups_participants',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "groups_participants_group_id_77e3cbc1",
        fields: [
          { name: "group_id" },
        ]
      },
      {
        name: "groups_participants_group_id_user_id_ccc2118b_uniq",
        unique: true,
        fields: [
          { name: "group_id" },
          { name: "user_id" },
        ]
      },
      {
        name: "groups_participants_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "groups_participants_user_id_e4f68d4e",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
