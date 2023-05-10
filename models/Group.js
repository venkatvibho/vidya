const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Group.init(sequelize, DataTypes);
}

class Group extends Sequelize.Model {
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
      allowNull: false,
      unique: "groups_title_f2ab20c3_uniq"
    },
    icon: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: 'groups',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "groups_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "groups_title_f2ab20c3_like",
        fields: [
          { name: "title" },
        ]
      },
      {
        name: "groups_title_f2ab20c3_uniq",
        unique: true,
        fields: [
          { name: "title" },
        ]
      },
      {
        name: "groups_user_id_55017db9",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
