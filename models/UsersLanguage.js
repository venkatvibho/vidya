const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return UsersLanguage.init(sequelize, DataTypes);
}

class UsersLanguage extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      unique: "users_language_user_id_languages_id_5abaf767_uniq"
    },
    languages_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'master_languages',
        key: 'id'
      },
      unique: "users_language_user_id_languages_id_5abaf767_uniq"
    }
  }, {
    sequelize,
    tableName: 'users_language',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "users_language_languages_id_c15dffe0",
        fields: [
          { name: "languages_id" },
        ]
      },
      {
        name: "users_language_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "users_language_user_id_a8b08ffa",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "users_language_user_id_languages_id_5abaf767_uniq",
        unique: true,
        fields: [
          { name: "user_id" },
          { name: "languages_id" },
        ]
      },
    ]
  });
  }
}
