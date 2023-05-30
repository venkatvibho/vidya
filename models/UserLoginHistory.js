const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return UserLoginHistory.init(sequelize, DataTypes);
}

class UserLoginHistory extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    device_id: {
      type: DataTypes.TEXT,
      allowNull: false
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
    tableName: 'user_login_history',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "user_login_history_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "user_login_history_user_id_44060508",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
