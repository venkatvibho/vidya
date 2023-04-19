const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return PollOption.init(sequelize, DataTypes);
}

class PollOption extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    poll_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'polls',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'poll_options',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "poll_options_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "poll_options_poll_id_cbbb3f0e",
        fields: [
          { name: "poll_id" },
        ]
      },
    ]
  });
  }
}
