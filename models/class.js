const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Class', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    trainerId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    dateTime: { type: DataTypes.DATE, allowNull: false },
    capacity: { type: DataTypes.INTEGER, allowNull: false },
  });

