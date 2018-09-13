const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

const {app} = require('../server')
const {Todo} = require('../models/todo')
const {User} = require('../models/user')
const {todos, populateTodos, users, populateUsers} = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)

describe('An API server', () => {

  context('when creating a new todo', () => {

    it('should create a new todo', (done) => {

      var text = 'Test todo text'

      request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
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
        .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((response) => {
        expect(response.body.todos.length).toBe(1)
      })
      .end(done)

    })

  })

  context('when getting a todo', () => {

    it('should return a todo', (done) => {

      request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((response) => {
        expect(response.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
    })

    it('should not return a todo created by other user', (done) => {

      request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)

    })

    context('when there is an invalid todo id', () => {

      it('should return a 404', (done) => {

        request(app)
        .get('/todos/123abc')
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done)

      })

    })

    context('when todo not found', () => {

      it('should return a 404', (done) => {

        var hexId = new ObjectID().toHexString()

        request(app)
        .get(`/todos/${hexId}`)
        .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[1].tokens[0].token)
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

    it('should not delete a todo of another user', (done) => {

      var hexId = todos[0]._id.toHexString()

      request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((error, response) => {

        if (error) {
          return done(error)
        }

        Todo.findById(hexId).then((todo) => {

          expect(todo).toExist()

          done()

        }).catch((error) => done(error))

      })

    })

    context('when todo id is invalid', () => {

      it('should return a 404', (done) => {

        request(app)
        .get('/todos/123abc')
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done)

      })

    })

    context('when todo is not found', () => {

      it('should return a 404', (done) => {

        var hexId = new ObjectID().toHexString()

        request(app)
        .get(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
      .send({text: 'text', completed: true})
      .expect(200)
      .expect((response) => {
        expect(response.body.todo.text).toBe('text').toBeA('string')
        expect(response.body.todo.completed).toBe(true)
        expect(response.body.todo.completedAt).toBeA('number')
      })
      .end(done)

    })

    it('should not update the todo of a different user', (done) => {

      var hexId = todos[0]._id.toHexString()

      request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({text: 'text', completed: true})
      .expect(404)
      .end(done)

    })

    context('when todo is not completed', () => {

      it('should clear the completedAt date', (done) => {

        var hexId = todos[1]._id.toHexString()

        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
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

  context('when getting current user', () => {

    context('when authenticated', () => {

      it('should return current user', (done) => {

        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((response) => {
          expect(response.body._id).toBe(users[0]._id.toHexString())
          expect(response.body.email).toBe(users[0].email)
        })
        .end(done)

      })

    })

    context('when not authenticated', () => {

      it('should return a 401', (done) => {

        request(app)
        .get('/users/me')
        .expect(401)
        .expect((response) => {
          expect(response.body).toEqual({})
        })
        .end(done)

      })

    })

  })

  context('when creating a user', () => {

    it('should create a user', (done) => {

      var email = 'example@example.com'

      var password = '123mnb!'

      request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((response) => {
        expect(response.headers['x-auth']).toExist()
        expect(response.body._id).toExist()
        expect(response.body.email).toBe(email)
      })
      .end((error) => {

        if (error) {

          return done(error)

        }

        User.findOne({email}).then((user) => {

          expect(user).toExist()
          expect(user.password).toNotBe(password)
          done()

        }).catch((error) => done(error))

      })

    })

    context('when request is invalid', () => {

      it('should return validation errors', (done) => {

        request(app)
        .post('/users')
        .send({
          email: 'and',
          password: '123'
        })
        .expect(400)
        .end(done)

      })

    })

    context('when email is in use', () => {

      it('should not create a user', (done) => {

        request(app)
        .post('/users')
        .send({
          email: users[0].email,
          password: 'password123!'
        })
        .expect(400)
        .end(done)

      })

    })

  })

  context('when a user logs in', () => {

    it('should login a user and return auth token', (done) => {

      request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((response) => {
        expect(response.headers['x-auth']).toExist()
      })
      .end((error, response) => {

        if (error) {
          return done(error)
        }

        User.findById(users[1]._id).then((user) => {

          expect(user.tokens[1]).toInclude({
            access: 'auth',
            token: response.headers['x-auth']
          })

          done()

        }).catch((error) => done(error))

      })

    })

    it('should reject an invalid login', (done) => {

      request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect((response) => {
        expect(response.headers['x-auth']).toNotExist()
      })
      .end((error, response) => {

        if (error) {
          return done(error)
        }

        User.findById(users[1]._id).then((user) => {

          expect(user.tokens.length).toBe(1)

          done()

        }).catch((error) => done(error))

      })

    })

  })

  context('when a user logs out', () => {

    it('should remove auth token on logout', (done) => {

      request(app)
        .delete('/users/me/token')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .end((error, response) => {

          if (error) {
            return done(error)
          }

          User.findById(users[0]._id).then((user) => {

            expect(user.tokens.length).toBe(0)

            done()

          }).catch((error) => done(error))

        })

    })

  })

})
