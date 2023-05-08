const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return MasterRegion.init(sequelize, DataTypes);
}

class MasterRegion extends Sequelize.Model {
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
      unique: "master_regions_title_key"
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
    tableName: 'master_regions',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "master_regions_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "master_regions_title_671e6eaa_like",
        fields: [
          { name: "title" },
        ]
      },
      {
        name: "master_regions_title_key",
        unique: true,
        fields: [
          { name: "title" },
        ]
      },
    ]
  });
  }
}
