// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (error, client) => {

  if (error) {

    return console.log('Unable to connect to MongoDB server')

  }

  console.log('Connected to MongoDB server')

  const db = client.db('TodoApp')

  // findOneAndUpdate
  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5b92c391338170a052e07cff')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result)
  // })

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5b92c915338170a052e07f42')
  }, {
    $set: {
      name: 'Brandt'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result)
  })

  // client.close()

})
