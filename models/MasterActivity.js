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
      allowNull: false
    },
    icon: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
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
    ]
  });
  }
}
