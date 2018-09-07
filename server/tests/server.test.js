const expect = require('expect')
const request = require('supertest')

const {app} = require('../server')
const {Todo} = require('../models/todo')

beforeEach((done) => {

  Todo.deleteMany().then(() => done())

})

describe('A server', () => {

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

          Todo.find().then((todos) => {

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

              expect(todos.length).toBe(0)
              done()

            }).catch((error) => done(error))

          })

      })

    })

  })

})
