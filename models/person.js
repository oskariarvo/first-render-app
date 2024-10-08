const mongoose = require("mongoose")

mongoose.set("strictQuery", false)

const url = process.env.MONGODB_URL

console.log("connecting to MongoDB")
mongoose.connect(url)
  .then(() => {
    console.log("connected to MongoDB")
  })
  .catch(error => {
    console.log(`error connecting to MongoDB ${error}`)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: (arr) => {
        const same = arr.split("-").length - 1
        return same === 1 && (arr[2] === "-" || arr[3] === "-")
      },
      message: "There has to be only 1 dash it has to be after 2 or 3 first numbers"
    }
  }
})
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model("Person", personSchema)