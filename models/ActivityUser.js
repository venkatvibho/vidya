const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return ActivityUser.init(sequelize, DataTypes);
}

class ActivityUser extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    activity_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'activities',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'activity_users',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "activity_users_activity_id_d0f28e88",
        fields: [
          { name: "activity_id" },
        ]
      },
      {
        name: "activity_users_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "activity_users_user_id_059bc478",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
