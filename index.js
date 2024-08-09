require("dotenv").config()
const express = require("express")
const logger = require("morgan")
const cors = require("cors")
const Person = require("./models/person")

const app = express()

app.use(express.static("dist"))
app.use(express.json())
app.use(cors())


logger.token("body", (req, res) => {
    if (req.method === "POST") {
        return JSON.stringify(req.body)
    } else {
        return " "
    }
})
app.use(logger(":method :url :status :res[content-length] - :response-time ms :body"))


app.get("/api/persons", (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get("/info", (req, res) => {
    const currentTime = new Date()
    const infoAll = `
    <div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${currentTime}</p>
    </div>`
    res.send(infoAll)
})

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post("/api/persons", (req, res) => {
    const body = req.body
    if (!body.name || !body.number) {
        const nameOrNumber = body.name ? "number" : "name"
        return res.status(400).json({
            error: `missing ${nameOrNumber}`
        })
    } else if (persons.find(p => body.name === p.name)) {
        return res.status(400).json({
            error: "name must be unique"
        })
    } else {
        let id
        do {id = Math.floor(Math.random() * 10000) + 1
            console.log(id)
        } while (persons.find(person => Number(person.id) === id))
        const person = {
            name: body.name,
            number: body.number,
            id: String(id)
        }
        persons = persons.concat(person)
        res.json(person)
    }
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})