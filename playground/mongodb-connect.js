// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (error, client) => {

  if (error) {

    return console.log('Unable to connect to MongoDB server')

  }

  console.log('Connected to MongoDB server')

  const db = client.db('TodoApp')

  // db.collection('Todos').find({
  //   _id: new ObjectID('5b91cdc18ef10ecafb634b2e')
  // }).toArray().then((documents) => {
  //
  //   console.log('Todos')
  //   console.log(JSON.stringify(documents, undefined, 2))
  //
  // }, (error) => {
  //
  //   console.log('Unable to fetch todos', error)
  //
  // })

  db.collection('Users').find({name: 'Brandt Daniels'}).toArray().then((document) => {

    console.log('Users')

    console.log(JSON.stringify(document, undefined, 2))

  }, (error) => {

    console.log('Unable to fetch todos', error)

  })

  // client.close()

})
