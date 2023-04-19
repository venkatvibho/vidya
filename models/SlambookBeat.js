const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return SlambookBeat.init(sequelize, DataTypes);
}

class SlambookBeat extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    beatquestions: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    upload_pics: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: false
    },
    happiest_moments: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    user_following_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'user_followings',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'slambook_beats',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "slambook_beats_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "slambook_beats_user_following_id_cb1b33af",
        fields: [
          { name: "user_following_id" },
        ]
      },
    ]
  });
  }
}
