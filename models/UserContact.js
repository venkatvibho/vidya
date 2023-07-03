const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return UserContact.init(sequelize, DataTypes);
}

class UserContact extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    phonenumber: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: "user_contacts_user_id_phonenumber_dea4cb85_uniq"
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      unique: "user_contacts_user_id_phonenumber_dea4cb85_uniq"
    }
  }, {
    sequelize,
    tableName: 'user_contacts',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "user_contacts_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "user_contacts_user_id_dcc5e6ea",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "user_contacts_user_id_phonenumber_dea4cb85_uniq",
        unique: true,
        fields: [
          { name: "user_id" },
          { name: "phonenumber" },
        ]
      },
    ]
  });
  }
}
