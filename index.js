require("dotenv").config({ path: __dirname + "/.env" });

const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan( ":method :url :status :res[content-length] - :response-time ms :content"))


morgan.token("content", req => {
    if (!req.body) return "";
    return JSON.stringify(req.body);
  });

let persons = 
    [
        {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
        },
        {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
        },
        { 
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
        }
    ]

const info = `<p> Phonebook has info for ${persons.length} people</p>
                <p>  ${new Date()} </p>
            `

//get all resources
app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

//new route
app.get('/info', (req, res) => {
    res.send(info)
  })

  //single resource fetch
  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
     if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })


//delete resource
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

//add resource
const newId = Math.floor(Math.random() * 100)

app.post('/api/persons', (request, response) => {
    const body = request.body

      if (!body.name || !body.number) {
        return response.status(400).json({ 
        error: 'content missing' 
        })  
    }

   const duplicatePerson = persons.filter((person) => person.name === body.name)

   if(duplicatePerson.length){
    return response.status(400).json({ 
    error: 'name must be unique' 
    })  
}

    const person = {
        name: body.name,
        number: body.number,
        id: newId
    }

    persons = persons.concat(person)
    response.json(person)
  })


const PORT = process.env.PORT || 3001


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})