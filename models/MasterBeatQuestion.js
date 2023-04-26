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
    }
  }, {
    sequelize,
    tableName: 'master_beat_questions',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "master_beat_questions_pkey1",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
