const {ObjectID} = require('mongodb')

const {mongoose} = require('../server/db/mongoose')
const {Todo} = require('../server/models/todo')
const {User} = require('../server/models/user')

// Todo.deleteOne({}).then((result) => {
//   console.log(result)
// })

// Todo.fineOneAndRemove()
Todo.findOneAndDelete('5b96dae3cd3b670339ed2c92', (todo) => {
  console.log(todo)
})
