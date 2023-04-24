const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return User.init(sequelize, DataTypes);
}

class User extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    phonenumber: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: "users_phonenumber_key"
    },
    user_id: {
      type: DataTypes.STRING(25),
      allowNull: false,
      unique: "users_user_id_key"
    },
    password: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    photo_1: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    photo_2: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    photo_3: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(6),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    latitude: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    longitude: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    region: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    language: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    experience: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    height: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    about_us: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    resetPawordToken: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(250),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'users',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "users_phonenumber_key",
        unique: true,
        fields: [
          { name: "phonenumber" },
        ]
      },
      {
        name: "users_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "users_user_id_26693996_like",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "users_user_id_key",
        unique: true,
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
