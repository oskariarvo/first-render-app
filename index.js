require("dotenv").config()
const express = require("express")
const logger = require("morgan")
const cors = require("cors")
const Person = require("./models/person")

const app = express()

app.use(express.static("dist"))
app.use(express.json())
app.use(cors())


logger.token("body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body)
  } else {
    return " "
  }
})
app.use(logger(":method :url :status :res[content-length] - :response-time ms :body"))


app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
    .catch(error => next(error))
})

app.get("/info", (req, res, next) => {
  const currentTime = new Date()
  Person.find({}).then(persons => {
    const infoNumber = persons.length
    console.log(persons)
    const infoAll = `
        <div>
            <p>Phonebook has info for ${infoNumber} people</p>
            <p>${currentTime}</p>
        </div>`
    res.send(infoAll)
  })
    .catch(error => next(error))
})

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post("/api/persons", (req, res, next) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})
app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(req.params.id, person, {new: true, runValidators: true, context: "query"})
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})


const unknownEndpoint = (req, res) => {
  res.status(404).send({error: "unknown endpoint"})
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return res.status(400).send({error: "malformatted id"})
  } else if (error.name === "ValidationError") {
    return res.status(400).json({error: error.message})
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})