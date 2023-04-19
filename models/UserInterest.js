const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return UserInterest.init(sequelize, DataTypes);
}

class UserInterest extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    interest_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'master_interests',
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
    tableName: 'user_interests',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "user_interests_interest_id_6145cf61",
        fields: [
          { name: "interest_id" },
        ]
      },
      {
        name: "user_interests_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "user_interests_user_id_62782381",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
