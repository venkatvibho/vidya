const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return DjangoMigration.init(sequelize, DataTypes);
}

class DjangoMigration extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    app: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    applied: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'django_migrations',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "django_migrations_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
