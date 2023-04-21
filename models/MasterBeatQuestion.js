const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return MasterBeatQuestion.init(sequelize, DataTypes);
}

class MasterBeatQuestion extends Sequelize.Model {
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
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    user_following_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'user_followings',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'master_beat_questions',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "master_beat_questions_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "master_beat_questions_user_following_id_c6ad34f0",
        fields: [
          { name: "user_following_id" },
        ]
      },
    ]
  });
  }
}
