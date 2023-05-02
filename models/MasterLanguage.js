const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return MasterLanguage.init(sequelize, DataTypes);
}

class MasterLanguage extends Sequelize.Model {
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
      unique: "master_languages_title_key"
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'master_languages',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "master_languages_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "master_languages_title_94d3b884_like",
        fields: [
          { name: "title" },
        ]
      },
      {
        name: "master_languages_title_key",
        unique: true,
        fields: [
          { name: "title" },
        ]
      },
    ]
  });
  }
}
