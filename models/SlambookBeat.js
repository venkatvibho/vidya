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
    status: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    upload_pics: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: true
    },
    happiest_moments: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    user_following_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'user_followings',
        key: 'id'
      },
      unique: "slambook_beats_user_following_id_cb1b33af_uniq"
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
        name: "slambook_beats_user_following_id_cb1b33af_uniq",
        unique: true,
        fields: [
          { name: "user_following_id" },
        ]
      },
    ]
  });
  }
}
