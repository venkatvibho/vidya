const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Poll.init(sequelize, DataTypes);
}

class Poll extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    expairy_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false
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
    tableName: 'polls',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "polls_group_id_9aa2e4bc",
        fields: [
          { name: "group_id" },
        ]
      },
      {
        name: "polls_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "polls_user_id_f5c76b13",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
