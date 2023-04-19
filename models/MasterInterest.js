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
    ]
  });
  }
}
