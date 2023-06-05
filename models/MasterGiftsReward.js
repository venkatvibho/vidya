const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return MasterGiftsReward.init(sequelize, DataTypes);
}

class MasterGiftsReward extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    users_count_from: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    users_count_to: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    r1_gift_value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    r1_users_count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    r2_gift_value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    r2_users_count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    r3_gift_value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    r3_users_count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    r4_gift_value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    r4_users_count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    r5_gift_value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    r5_users_count: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'master_gifts_rewards',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "master_gifts_rewards_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
