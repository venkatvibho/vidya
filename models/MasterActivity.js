const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return MasterActivity.init(sequelize, DataTypes);
}

class MasterActivity extends Sequelize.Model {
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
      unique: "master_activities_title_345b8563_uniq"
    },
    icon: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'master_activities',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "master_activities_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "master_activities_title_345b8563_like",
        fields: [
          { name: "title" },
        ]
      },
      {
        name: "master_activities_title_345b8563_uniq",
        unique: true,
        fields: [
          { name: "title" },
        ]
      },
    ]
  });
  }
}
