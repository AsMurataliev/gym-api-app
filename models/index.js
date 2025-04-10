const { Sequelize } = require('sequelize');
const TrainerModel = require('./trainer');
const ClientModel = require('./client');
const ClassModel = require('./class');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
});

const Trainer = TrainerModel(sequelize);
const Client = ClientModel(sequelize);
const GymClass = ClassModel(sequelize);

// Associations
Trainer.hasMany(GymClass, { foreignKey: 'trainerId' });
GymClass.belongsTo(Trainer, { foreignKey: 'trainerId' });

Client.belongsToMany(GymClass, { through: 'ClassClients', foreignKey: 'clientId' });
GymClass.belongsToMany(Client, { through: 'ClassClients', foreignKey: 'classId' });

module.exports = { sequelize, Trainer, Client, GymClass };

