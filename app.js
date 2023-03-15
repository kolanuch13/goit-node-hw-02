const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
require('dotenv').config();

const contactsRouter = require('./api/contacts')
const usersRouter = require('./api/users')

mongoose.Promise = global.Promise;

mongoose.connect(process.env.DB_HOST)
  .then(()=>console.log("Database connect"))
  .catch((error)=>console.log(error.message))

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())
require('./config/config-passport')

app.use('/api/contacts', contactsRouter)
app.use('/api/users', usersRouter)
app.use('/static', express.static(__dirname + '/public'));

app.use((req, res) => {
  res.status(404).json({ message: 'Not found:(' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app
