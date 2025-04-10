const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Client', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false },
    membershipType: { type: DataTypes.STRING, allowNull: false },
  });

