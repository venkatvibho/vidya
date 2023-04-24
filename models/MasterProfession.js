const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return MasterProfession.init(sequelize, DataTypes);
}

class MasterProfession extends Sequelize.Model {
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
      unique: "master_professions_industry_id_title_f1ac32e5_uniq"
    },
    icon: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    industry_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'master_industries',
        key: 'id'
      },
      unique: "master_professions_industry_id_title_f1ac32e5_uniq"
    }
  }, {
    sequelize,
    tableName: 'master_professions',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "master_professions_industry_id_e933a1d9",
        fields: [
          { name: "industry_id" },
        ]
      },
      {
        name: "master_professions_industry_id_title_f1ac32e5_uniq",
        unique: true,
        fields: [
          { name: "industry_id" },
          { name: "title" },
        ]
      },
      {
        name: "master_professions_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
