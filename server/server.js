const {ObjectID} = require('mongodb')

var express = require('express')
var bodyParser = require('body-parser')

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo')
var {User} = require('./models/user')

var app = express()

app.use(bodyParser.json())

app.post('/todos', (request, response) => {

  var todo = new Todo({
    text: request.body.text
  })

  todo.save().then((document) => {
    response.send(document)
  }, (error) => {
    response.status(400).send(error)
  })

})

app.get('/todos', (request, response) => {

  Todo.find().then((todos) => {
    response.send({todos})
  }, (error) => {
    response.status(400).send(error)
  })

})

app.get('/todos/:id', (request, response) => {

  var id = request.params.id

  if (!ObjectID.isValid(id)) {

    return response.status(404).send()

  }

  Todo.findById(id).then((todo) => {

    if (!todo) {

      return response.status(404).send()

    }

    response.send(todo)

  }).catch((error => response.status(400).send()))

})

app.listen(3000, () => {
  console.log('Started on port 3000')
})

module.exports = {app}
