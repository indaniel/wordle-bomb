const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server,{path:"/api/socket"})
const port = 3001
const fs = require('fs')
const Gamestate = require('./gamelogic');

var gamestate;

app.get('/api/', (req, res) => {
  res.send('Hello World!')
})


io.on('connection',(socket)=>{
  console.log("user connected")
  
})


app.get("/api/gamestate", (req, res) => {
  res.send({history: gamestate.history, current : gamestate.players[gamestate.currentPlayer]});



})


server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  gamestate = new Gamestate();
})

