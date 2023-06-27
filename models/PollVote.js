const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return PollVote.init(sequelize, DataTypes);
}

class PollVote extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    group_chat_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'group_chat',
        key: 'id'
      }
    },
    poll_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'polls',
        key: 'id'
      }
    },
    poll_option_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'poll_options',
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
    tableName: 'poll_votes',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "poll_votes_group_chat_id_43d6922f",
        fields: [
          { name: "group_chat_id" },
        ]
      },
      {
        name: "poll_votes_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "poll_votes_poll_id_e14568d8",
        fields: [
          { name: "poll_id" },
        ]
      },
      {
        name: "poll_votes_poll_option_id_7855fa9e",
        fields: [
          { name: "poll_option_id" },
        ]
      },
      {
        name: "poll_votes_user_id_fc1a3b4b",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
