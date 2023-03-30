const express = require('express')

const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())

let notes = [
    {
        "id": 1,
        "content": "HTML is Easy",
        "date": "2023-02-14",
        "important": true
    },
    {
        "id": 2,
        "content": "Browser can execute only JavaScript",
        "date": "2023-02-15",
        "important": false
    },
    {
        "id": 3,
        "content": "GET and POST are the most important methods of HTTP protocol",
        "date": "2023-02-15",
        "important": true
    }
]

const requestLogger = (request, response, next) => {
    console.log('Method: ',request.method);
    console.log('Path: ',request.path);
    console.log('Body: ',request.body);
    console.log('-------------------------------------------------------------------------');

    next()
}

app.use(requestLogger)

app.get('/', (request, response) => {
    response.send('<h1>Welcome to Notes API</h1>')
})

app.get('/api/notes', (request, response)=>{
    response.json(notes)
} )

//las variables se identifican con los puntos ":"
app.get('/api/notes/:id', (request, response)=>{
    const id = Number( request.params.id)
    console.log('id: ',id);
    const note = notes.find(x => x.id === id )
    console.log(note);
    if (note) {
        response.json(note)
    }
    else{
        response.status(404).send()
    }
} )

app.delete('/api/notes/:id', (request, response)=>{
    const id = Number( request.params.id)
    let size = notes.length
    notes = notes.filter(x =>x.id !== id )
    if (size > notes.length) {
        response.status(204).send()
    }
    else{
        response.status(404).send()
    }
})


const generateId = ()  => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(x => x.id))
        : 0
    return maxId + 1
}

app.post('/api/notes',(request, response) => {
    const body = request.body
    console.log(body);
    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId()
    }
    notes = notes.concat(note)
    response.json(note)
})

app.put('/api/notes/:id', (request, response)=>{
    const id = Number( request.params.id)
    console.log('id: ',id);

    const note = notes.find(x => x.id === id )

    const body = request.body
    const noteUpdate = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: body.id
    }
    console.log(note);
    if (note) {
        notes = notes.map(x => x.id !== id ? x : noteUpdate)
        response.json(noteUpdate)
    }
    else{
        response.status(404).send()
    }
} )


const unknownPath = (request, response) => {
    response.status(404).json()({
        error : 'unknown Path'
    })
}


app.use(unknownPath)

const PORT = process.env.PORT ||3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

