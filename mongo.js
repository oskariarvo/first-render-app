const mongoose = require("mongoose")

const password = process.argv[2]

const url = `mongodb+srv://oskarsson:${password}@klusteri0.qyxcj.mongodb.net/personApp?retryWrites=true&w=majority&appName=Klusteri0`

mongoose.set("strictQuery", false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model("Person", personSchema) 

if (process.argv.length > 3) {
  const person = new Person({
    name: `${process.argv[3]}`,
    number: `${process.argv[4]}`,
  })
  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Person
    .find({})
    .then(result => {
      console.log("phonebook:")
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
}