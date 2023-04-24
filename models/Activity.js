const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Activity.init(sequelize, DataTypes);
}

class Activity extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    type_of_badges: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    type_of_activity: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    latitude: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    longitude: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    activity_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'master_activities',
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
    tableName: 'activities',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "activities_activity_id_e7b2d538",
        fields: [
          { name: "activity_id" },
        ]
      },
      {
        name: "activities_group_id_f664c654",
        fields: [
          { name: "group_id" },
        ]
      },
      {
        name: "activities_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "activities_user_id_8e415daf",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
