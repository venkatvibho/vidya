const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return PostUserReport.init(sequelize, DataTypes);
}

class PostUserReport extends Sequelize.Model {
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
    postuser_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'post_users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'post_user_reports',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "post_user_reports_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "post_user_reports_postuser_id_8a80d2a3",
        fields: [
          { name: "postuser_id" },
        ]
      },
    ]
  });
  }
}
