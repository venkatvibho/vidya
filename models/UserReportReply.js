const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return UserReportReply.init(sequelize, DataTypes);
}

class UserReportReply extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    user_report_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'user_reports',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'user_report_replies',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "user_report_replies_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "user_report_replies_post_user_report_id_e3c58376",
        fields: [
          { name: "user_report_id" },
        ]
      },
      {
        name: "user_report_replies_user_id_id_1d81e490",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
