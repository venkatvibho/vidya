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
      },
      unique: "activity_users_activity_id_user_id_7338c471_uniq"
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      unique: "activity_users_activity_id_user_id_7338c471_uniq"
    },
    acceptedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejectedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    group_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'groups',
        key: 'id'
      }
    },
    honour: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    rejectedReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    joineddAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    acceptedBy: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    rejectedBy: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    sentBy: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    f2: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    general: {
      type: DataTypes.BIGINT,
      allowNull: true
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
        name: "activity_users_activity_id_user_id_7338c471_uniq",
        unique: true,
        fields: [
          { name: "activity_id" },
          { name: "user_id" },
        ]
      },
      {
        name: "activity_users_group_id_e0270753",
        fields: [
          { name: "group_id" },
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
