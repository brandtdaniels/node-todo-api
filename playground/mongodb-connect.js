// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (error, client) => {

  if (error) {

    return console.log('Unable to connect to MongoDB server')

  }

  console.log('Connected to MongoDB server')

  const db = client.db('TodoApp')

  client.close()

})
