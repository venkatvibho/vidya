const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return UserReport.init(sequelize, DataTypes);
}

class UserReport extends Sequelize.Model {
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
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    from_user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    to_user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'user_reports',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "user_reports_from_user_id_id_ffb56456",
        fields: [
          { name: "from_user_id" },
        ]
      },
      {
        name: "user_reports_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "user_reports_to_user_id_id_c82af22f",
        fields: [
          { name: "to_user_id" },
        ]
      },
    ]
  });
  }
}
