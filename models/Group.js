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
      allowNull: false
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
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
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
        name: "groups_user_id_55017db9",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
