const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Donation.init(sequelize, DataTypes);
}

class Donation extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    surname: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ReferenceNo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    PurposeofDonation: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phonenumber: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    whatsupnumber: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    adhar: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reffered_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    reffered_person_number: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    gothram: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    donation_type: {
      type: DataTypes.ENUM('UPI','DD','CASH','CHEQUE','ONLINE'),
      allowNull: true
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    amount_in_words: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    donation_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    photo: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    id_proof_photo: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    }
    ,createdAt: {
      field: 'created_at',
      type: Sequelize.DATE
    },
    updatedAt: {
      field: 'updated_at',
      type: Sequelize.DATE
    }
  }, {
    sequelize,
    tableName: 'donations',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
