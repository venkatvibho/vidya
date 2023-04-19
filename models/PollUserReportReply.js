const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return PollUserReportReply.init(sequelize, DataTypes);
}

class PollUserReportReply extends Sequelize.Model {
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
        model: 'poll_user_reports',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'poll_user_report_replies',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "poll_user_report_replies_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "poll_user_report_replies_postuserreport_id_ff52d2af",
        fields: [
          { name: "postuserreport_id" },
        ]
      },
    ]
  });
  }
}
