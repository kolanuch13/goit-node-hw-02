const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config();

const contactsRouter = require('./api/index')

// const DB_HOST = "mongodb+srv://kolanuch13:ekfrp8CqtUdjs2Oi@cluster0.l5tid8d.mongodb.net/db-contacts?retryWrites=true&w=majority";
mongoose.Promise = global.Promise;

mongoose.connect(process.env.DB_HOST)
  .then(()=>console.log("Database connect"))
  .catch((error)=>console.log(error.message))

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/contacts', contactsRouter)


app.use((req, res) => {
  res.status(404).json({ message: 'Not found:(' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app
