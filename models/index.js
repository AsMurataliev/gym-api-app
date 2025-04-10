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

Trainer.hasMany(GymClass, { foreignKey: 'trainerId' }); // тренер ведет много занятий
GymClass.belongsTo(Trainer, { foreignKey: 'trainerId' }); // каждое занятие связанно с тренером

Client.belongsToMany(GymClass, { through: 'ClassClients', foreignKey: 'clientId' }); // клиент может посещать много занятий
GymClass.belongsToMany(Client, { through: 'ClassClients', foreignKey: 'classId' }); // и занятий включают много клиентов

module.exports = { sequelize, Trainer, Client, GymClass };

