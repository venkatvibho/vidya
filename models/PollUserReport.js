const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return PollUserReport.init(sequelize, DataTypes);
}

class PollUserReport extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    polltuser_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'poll_users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'poll_user_reports',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "poll_user_reports_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "poll_user_reports_postuser_id_c3d2328d",
        fields: [
          { name: "polltuser_id" },
        ]
      },
    ]
  });
  }
}
