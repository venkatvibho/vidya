const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return MasterIndustry.init(sequelize, DataTypes);
}

class MasterIndustry extends Sequelize.Model {
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
      unique: "master_industries_title_5c8c57c8_uniq"
    },
    icon: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'master_industries',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "master_industries_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "master_industries_title_5c8c57c8_like",
        fields: [
          { name: "title" },
        ]
      },
      {
        name: "master_industries_title_5c8c57c8_uniq",
        unique: true,
        fields: [
          { name: "title" },
        ]
      },
    ]
  });
  }
}
