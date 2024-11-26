const express = require('express')
const Note = require('./models/note')
const cors = require('cors')
const mongoose = require('mongoose')



const app = express()

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

app.get('/', (request, response) =>{
    response.send('<h1>Hello World</h1>')
})


app.get('/api/notes', (request, response)=> {
    Note.find({}).then(notes => {
      response.json(notes)
    })
})

app.get('/api/notes/:id', async (request, response)=> {
    const id = request.params.id
    await Note.findById(id).then(note => {
      !note? response.status(400).json({message: "Note not found."})
      :response.status(200).json(note)})
      .catch((err)=> response.status(500).json({message: "Failed to find the note.", err}))
})

app.delete('/api/notes/:id', async (request, response)=>{
  const id = request.params.id
  await Note.findByIdAndDelete(id)
  response.status(204).end()
})

app.post('/api/notes', async (request, response)=>{
  const body = request.body
  
  if(!body.content){
    return response.status(400).json({
      error: 'content missing'
    })
  }
  
  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  await note.save().then(savedNotes => {
    return response.status(201).json(savedNotes)
  }).catch((err)=>response.status(500).json({message:"Error saving the notes.",err}))
})

app.put('/api/notes/:id', async (request, response)=>{
  const body = request.body
  const id = request.params.id

  await Note.findByIdAndUpdate(id, body, {new:true})
  .then(note=> response.status(200).json(note))
  .catch((err) => response.status(500).json({message: "Failed to update the note."}))

})

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})
