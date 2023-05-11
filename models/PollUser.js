const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return PollUser.init(sequelize, DataTypes);
}

class PollUser extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    poll_option_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'poll_options',
        key: 'id'
      },
      unique: "poll_users_poll_id_user_id_poll_option_id_f01c89bd_uniq"
    },
    poll_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'polls',
        key: 'id'
      },
      unique: "poll_users_poll_id_user_id_poll_option_id_f01c89bd_uniq"
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      unique: "poll_users_poll_id_user_id_poll_option_id_f01c89bd_uniq"
    }
  }, {
    sequelize,
    tableName: 'poll_users',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "poll_users_is_voted_option_id_3de08026",
        fields: [
          { name: "poll_option_id" },
        ]
      },
      {
        name: "poll_users_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "poll_users_poll_id_user_id_poll_option_id_f01c89bd_uniq",
        unique: true,
        fields: [
          { name: "poll_id" },
          { name: "user_id" },
          { name: "poll_option_id" },
        ]
      },
      {
        name: "poll_users_post_id_8957c4ef",
        fields: [
          { name: "poll_id" },
        ]
      },
      {
        name: "poll_users_user_id_03001c68",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
