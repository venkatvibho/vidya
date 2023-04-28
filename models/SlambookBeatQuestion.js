const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return SlambookBeatQuestion.init(sequelize, DataTypes);
}

class SlambookBeatQuestion extends Sequelize.Model {
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
    answer: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    user_following_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'slambook_beats',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'slambook_beat_questions',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "slambook_beat_questions_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "slambook_beat_questions_user_following_id_f844904d",
        fields: [
          { name: "user_following_id" },
        ]
      },
    ]
  });
  }
}
