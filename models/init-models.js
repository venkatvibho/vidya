const DataTypes = require("sequelize").DataTypes;
const _Donation = require("./Donation");
const _User = require("./User");

function initModels(sequelize) {
  const Donation = _Donation(sequelize, DataTypes);
  const User = _User(sequelize, DataTypes);


  return {
    Donation,
    User,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
