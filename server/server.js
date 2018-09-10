const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo')
var {User} = require('./models/user')

var app = express()

const port = process.env.PORT || 3000

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

    response.send({todo})

  }).catch((error => response.status(400).send()))

})

app.delete('/todos/:id', (request, response) => {

  var id = request.params.id

  if (!ObjectID.isValid(id)) {

    return response.status(404).send()

  }

  Todo.findByIdAndDelete(id).then((todo) => {

    if (!todo) {

      return response.status(404).send()

    }

    response.send({todo})

  }).catch((error => response.status(400).send()))

})

app.patch('/todos/:id', (request, response) => {

  var id = request.params.id

  var body = _.pick(request.body, ['text', 'completed'])

  if (!ObjectID.isValid(id)) {

    return response.status(404).send()

  }

  if (_.isBoolean(body.completed) && body.completed) {

      body.completedAt = new Date().getTime()

  } else {

    body.completed = false

    body.completedAt = null

  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {

    if (!todo) {

      return response.status(404).send()

    }

    response.send({todo})

  }).catch((error) => {
    response.status(400).send()
  })

})

app.listen(port, () => {
  console.log(`Started on port ${port}`)
})

module.exports = {app}
