const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return ActivityGroup.init(sequelize, DataTypes);
}

class ActivityGroup extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    activity_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'activities',
        key: 'id'
      }
    },
    group_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'groups',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'activity_groups',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "activity_groups_activity_id_3dc9c3c3",
        fields: [
          { name: "activity_id" },
        ]
      },
      {
        name: "activity_groups_group_id_06b76c9d",
        fields: [
          { name: "group_id" },
        ]
      },
      {
        name: "activity_groups_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
