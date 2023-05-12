const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return PollViewed.init(sequelize, DataTypes);
}

class PollViewed extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    poll_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'polls',
        key: 'id'
      },
      unique: "poll_viewed_poll_id_user_id_9e565596_uniq"
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      unique: "poll_viewed_poll_id_user_id_9e565596_uniq"
    }
  }, {
    sequelize,
    tableName: 'poll_viewed',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "poll_viewed_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "poll_viewed_poll_id_cbe927b4",
        fields: [
          { name: "poll_id" },
        ]
      },
      {
        name: "poll_viewed_poll_id_user_id_9e565596_uniq",
        unique: true,
        fields: [
          { name: "poll_id" },
          { name: "user_id" },
        ]
      },
      {
        name: "poll_viewed_user_id_f45f3406",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
