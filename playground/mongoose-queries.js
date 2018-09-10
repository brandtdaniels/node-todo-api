const {ObjectID} = require('mongodb')

const {mongoose} = require('../server/db/mongoose')
const {Todo} = require('../server/models/todo')
const {User} = require('../server/models/user')

// var id = '5b9302d4c70eecea38b0cc10'
//
// if(!ObjectID.isValid(id)) {
//
//   console.log('ID not valid')
//
// }


// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos)
// })

// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo)
// })
//
// Todo.findById(id).then((todo) => {
//
//   if (!todo) {
//     return console.log('Id not found')
//   }
//
//   console.log('Todo by ID', todo)
//
// }).catch((error) => console.log(error))


// User.findById
User.findById('5b930791338170a052e09613').then((user) => {

  if (!user) {
    return console.log('Unable to find user')
  }

  console.log(JSON.stringify(user, undefined, 2))

}).catch((error => console.log(error)))
