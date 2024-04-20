require('dotenv').config();
const mongoose = require("mongoose");

function connectToDatabase() {
  return new Promise((resolve, reject) => {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        console.log(`Connected to DB`)
        resolve();
      }).catch((err) => {
        console.err(`Error connecting to DB: ${err}`)
        reject(err)
      })
  })
}

module.exports = connectToDatabase;