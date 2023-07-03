const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Call.init(sequelize, DataTypes);
}

class Call extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    is_missed_call: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    startDateTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDateTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    call_user_from_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    call_user_to_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'calls',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "calls_call_user_from_id_d73c5a38",
        fields: [
          { name: "call_user_from_id" },
        ]
      },
      {
        name: "calls_call_user_to_id_38d4e367",
        fields: [
          { name: "call_user_to_id" },
        ]
      },
      {
        name: "calls_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
