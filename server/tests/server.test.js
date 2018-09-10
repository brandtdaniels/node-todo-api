const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

const {app} = require('../server')
const {Todo} = require('../models/todo')

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}]

beforeEach((done) => {

  Todo.deleteMany().then(() => {
    return Todo.insertMany(todos)
  }).then(() => done())

})

describe('An API server', () => {

  context('when creating a new todo', () => {

    it('should create a new todo', (done) => {

      var text = 'Test todo text'

      request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((response) => {
          expect(response.body.text).toBe(text)
        })
        .end((error, response) => {

          if (error) {
            return done(error)
          }

          Todo.find({text}).then((todos) => {

            expect(todos.length).toBe(1)
            expect(todos[0].text).toBe(text)
            done()

          }).catch((error) => done(error))

        })

    })

    context('when body data is invalid', () => {

      it('should not create a new todo', (done) => {

        request(app)
          .post('/todos')
          .send({})
          .expect(400)
          .end((error, response) => {

            if (error) {
              return done(error)
            }

            Todo.find().then((todos) => {

              expect(todos.length).toBe(2)
              done()

            }).catch((error) => done(error))

          })

      })

    })

  })

  context('when getting a list of todos', () => {

    it('should get all todos', (done) => {

      request(app)
        .get('/todos')
        .expect(200)
        .expect((response) => {
          expect(response.body.todos.length).toBe(2)
        })
        .end(done)

    })

  })

  context('when getting a todo', () => {

    it('should return a todo', (done) => {

      request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((response) => {
          expect(response.body.todo.text).toBe(todos[0].text)
        })
        .end(done)
    })

    context('when there is an invalid todo id', () => {

      it('should return a 404', (done) => {

        request(app)
          .get('/todos/123abc')
          .expect(404)
          .end(done)

      })

    })

    context('when todo not found', () => {

      it('should return a 404', (done) => {

        var hexId = new ObjectID().toHexString()

        request(app)
          .get(`/todos/${hexId}`)
          .expect(404)
          .end(done)

      })

    })

  })

  context('when deleting a todo', () => {

    it('should delete a todo', (done) => {

      var hexId = todos[1]._id.toHexString()

      request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((response) => {
          expect(response.body.todo.text).toBe(todos[1].text)
        })
        .end((error, response) => {

          if (error) {
            return done(error)
          }

          Todo.findById(hexId).then((todo) => {

            expect(todo).toNotExist()

            done()

          }).catch((error) => done(error))

        })

    })

    context('when todo id is invalid', () => {

      it('should return a 404', (done) => {

        request(app)
          .get('/todos/123abc')
          .expect(404)
          .end(done)

      })

    })

    context('when todo is not found', () => {

      it('should return a 404', (done) => {

        var hexId = new ObjectID().toHexString()

        request(app)
          .get(`/todos/${hexId}`)
          .expect(404)
          .end(done)

      })

    })

  })

  context('when updating a todo', () => {

    it('should update the todo', (done) => {

      var hexId = todos[0]._id.toHexString()

      request(app)
        .patch(`/todos/${hexId}`)
        .send({text: 'text', completed: true})
        .expect(200)
        .expect((response) => {
          expect(response.body.todo.text).toBe('text').toBeA('string')
          expect(response.body.todo.completed).toBe(true)
          expect(response.body.todo.completedAt).toBeA('number')
        })
        .end(done)

    })

    context('when todo is not completed', () => {

      it('should clear the completedAt date', (done) => {

        var hexId = todos[1]._id.toHexString()

        request(app)
          .patch(`/todos/${hexId}`)
          .send({text: 'text', completed: false})
          .expect(200)
          .expect((response) => {
            expect(response.body.todo.text).toBe('text').toBeA('string')
            expect(response.body.todo.completed).toBe(false)
            expect(response.body.todo.completedAt).toNotExist()
          })
          .end(done)

      })

    })

  })

})
