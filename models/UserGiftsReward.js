const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return UserGiftsReward.init(sequelize, DataTypes);
}

class UserGiftsReward extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    totalpoints: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    coupon_type: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    coupon_code: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    isRedeemed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    category: {
      type: DataTypes.STRING(250),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'user_gifts_rewards',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "user_gifts_rewards_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "user_gifts_rewards_user_id_e68226f9",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
