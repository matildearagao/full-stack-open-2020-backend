require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

app.use(express.static("build"));
app.use(express.json());
app.use(cors());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  )
);

morgan.token("content", (req) => {
  if (!req.body) return "";
  return JSON.stringify(req.body);
});

//new route
app.get("/info", (req, res) => {
  Person.find({}).then((people) => {
    let persons = people.length;
    const info = `<p> Phonebook has info for ${persons} people</p>
                <p>  ${new Date()} </p>
            `;
    res.send(info);
  });
});

//get all resources
app.get("/api/persons", (req, res) => {
  Person.find({}).then((people) => {
    res.json(people.map((person) => person.toJSON()));
  });
});

//single resource fetch
app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id).then((person) => {
    if (person) {
      res.json(person.toJSON());
    } else {
      res.status(404).end();
    }
  })
  .catch(error => next(error))
});

//delete resource
app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

//add resource
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const persons = [];

  const duplicatePerson = persons.filter((person) => person.name === body.name);

  if (duplicatePerson.length) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson.toJSON());
  });
});


//modify person
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person)
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})



const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
