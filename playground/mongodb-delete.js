// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (error, client) => {

  if (error) {

    return console.log('Unable to connect to MongoDB server')

  }

  console.log('Connected to MongoDB server')

  const db = client.db('TodoApp')

  // deleteMany
  db.collection('Users').deleteMany({name: 'Brandt Daniels'}).then((result) => {

    console.log(result)

  })

  // deleteOne
  db.collection('Users').deleteOne({
    _id: new ObjectID('5b92c4ba338170a052e07d8a')
  }).then((result) => {

    console.log(result)

  })

  // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //
  //   console.log(result)
  //
  // })


  // client.close()

})
