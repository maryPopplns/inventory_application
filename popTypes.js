const path = require('path');
const winston = require('winston');
const mongoose = require('mongoose');
const axios = require('axios').default;
const Type = require(path.join(__dirname, '/models/type'));
const Pokemon = require(path.join(__dirname, '/models/pokemon'));
require('dotenv').config();

mongoose.connect(process.env.MONGO_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'logs/all.log' }),
  ],
});

for (let i = 1; i < 3; i++) {
  (async function getUser() {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/type/${i}`);
      console.log(response.data.name);
    } catch (error) {
      logger.error(error);
    }
  })();
}

mongoose.connection.close();
