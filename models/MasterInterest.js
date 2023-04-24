const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return MasterInterest.init(sequelize, DataTypes);
}

class MasterInterest extends Sequelize.Model {
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
      unique: "master_interests_title_6ad481b7_uniq"
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
    tableName: 'master_interests',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "master_interests_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "master_interests_title_6ad481b7_like",
        fields: [
          { name: "title" },
        ]
      },
      {
        name: "master_interests_title_6ad481b7_uniq",
        unique: true,
        fields: [
          { name: "title" },
        ]
      },
    ]
  });
  }
}
