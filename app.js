const express = require("express");
const { sequelize, Trainer, Client, GymClass } = require("./models");
const setupSwagger = require("./swagger");
const app = express();
const port = 3000;

app.use(express.json());
setupSwagger(app);

/**
 * @swagger
 * /trainers:
 *   get:
 *     summary: Получить список всех тренеров
 *     responses:
 *       200:
 *         description: Список тренеров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trainer'
 */
app.get('/trainers', async (req, res) => {
  const trainers = await Trainer.findAll();
  res.json(trainers);
});

/**
 * @swagger
 * /trainers:
 *   post:
 *     summary: Создать нового тренера
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trainer'
 *     responses:
 *       201:
 *         description: Тренер создан
 */
app.post('/trainers', async (req, res) => {
  try {
    const trainer = await Trainer.create(req.body);
    res.status(201).json(trainer);
  } catch {
    res.status(400).json({ error: 'Ошибка при создании тренера' });
  }
});

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Получить список всех клиентов
 *     responses:
 *       200:
 *         description: Список клиентов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 */
app.get('/clients', async (req, res) => {
  const clients = await Client.findAll();
  res.json(clients);
});

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Создать нового клиента
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       201:
 *         description: Клиент создан
 */
app.post('/clients', async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch {
    res.status(400).json({ error: 'Ошибка при создании клиента' });
  }
});

/**
 * @swagger
 * /classes:
 *   get:
 *     summary: Получить список всех занятий
 *     responses:
 *       200:
 *         description: Список занятий
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Class'
 */
app.get('/classes', async (req, res) => {
  const classes = await GymClass.findAll({ include: [Trainer, Client] });
  res.json(classes);
});

/**
 * @swagger
 * /classes:
 *   post:
 *     summary: Создать новое занятие
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Class'
 *     responses:
 *       201:
 *         description: Занятие создано
 */
app.post('/classes', async (req, res) => {
  const { title, trainerId, dateTime, capacity } = req.body;
  const trainer = await Trainer.findByPk(trainerId);
  if (!trainer) return res.status(404).json({ error: 'Тренер не найден' });

  try {
    const newClass = await GymClass.create({ title, trainerId, dateTime, capacity });
    res.status(201).json(newClass);
  } catch {
    res.status(400).json({ error: 'Ошибка при создании занятия' });
  }
});

/**
 * @swagger
 * /classes/{id}:
 *   post:
 *     summary: Записать клиента на занятие
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID занятия
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *             properties:
 *               clientId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Клиент добавлен
 *       400:
 *         description: Ошибка записи
 *       404:
 *         description: Класс или клиент не найден
 */
app.post('/classes/:id', async (req, res) => {
  const classId = req.params.id;
  const { clientId } = req.body;

  const gymClass = await GymClass.findByPk(classId, { include: [Client] });
  if (!gymClass) return res.status(404).json({ error: 'Класс не найден' });

  const client = await Client.findByPk(clientId);
  if (!client) return res.status(404).json({ error: 'Клиент не найден' });

  const participants = await gymClass.getClients();
  if (participants.find((p) => p.id === client.id)) {
    return res.status(400).json({ error: 'Клиент уже записан' });
  }

  if (participants.length >= gymClass.capacity) {
    return res.status(400).json({ error: 'Класс заполнен' });
  }

  await gymClass.addClient(client);
  res.json({ message: 'Клиент добавлен' });
});

app.get('/', (req, res) => {
  res.send('Добро пожаловать в Gym');
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Trainer:
 *       type: object
 *       required:
 *         - name
 *         - specialization
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         specialization:
 *           type: string
 *         email:
 *           type: string
 *     Client:
 *       type: object
 *       required:
 *         - name
 *         - age
 *         - membershipType
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         age:
 *           type: integer
 *         membershipType:
 *           type: string
 *     Class:
 *       type: object
 *       required:
 *         - title
 *         - trainerId
 *         - dateTime
 *         - capacity
 *       properties:
 *         id:
 *           type: integer
 *         trainerId:
 *           type: integer
 *         title:
 *           type: string
 *         dateTime:
 *           type: string
 *           format: date-time
 *         capacity:
 *           type: integer
 */

sequelize.sync({ force: false }).then(() => {
  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
});

