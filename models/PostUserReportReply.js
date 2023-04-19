const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return PostUserReportReply.init(sequelize, DataTypes);
}

class PostUserReportReply extends Sequelize.Model {
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
    postuserreport_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'post_user_reports',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'post_user_report_replies',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "post_user_report_replies_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "post_user_report_replies_postuserreport_id_859c638c",
        fields: [
          { name: "postuserreport_id" },
        ]
      },
    ]
  });
  }
}
