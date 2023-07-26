const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return UserLogoutHistory.init(sequelize, DataTypes);
}

class UserLogoutHistory extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
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
    tableName: 'user_logout_history',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "user_logout_history_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "user_logout_history_user_id_909fc0ea",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
