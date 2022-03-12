const express = require('express')
const app = express()
const port = 3001
const fs = require('fs')
const Gamestate = require('./gamelogic');

var gamestate;

app.get('/api/', (req, res) => {
  res.send('Hello World!')
})




app.get("/api/gamestate", (req, res) => {
  res.send({history: gamestate.history, current : gamestate.players[gamestate.currentPlayer]});



})


app.listen(port, () => {

  console.log(`Example app listening on port ${port}`)
  gamestate = new Gamestate();
})