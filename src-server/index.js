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
  // on connect fire join function
  socket.on('join',(data)=>{
    console.log(data.user, "joined")
    gamestate.join(data.user)
  }) 
  socket.on("guess",(data)=>{
    console.log(data.user, "guessed", data.guess)
    gamestate.guessWord(data.guess,data.user)
    //socket.broadcast.emit(gamestate.snapshot())
  })
})

app.get("/api/gamestate", (req, res) => {
  res.send({history: gamestate.history, current : gamestate.players[gamestate.currentPlayer]});
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  gamestate = new Gamestate(function(){
    console.log("Emitting")
    const ss = gamestate.snapshot();
    console.log(ss)
    io.sockets.emit("update",ss)
  });

  // setInterval(() => {
  //   console.log(gamestate.snapshot());
  // }, 500);

  // gamestate.join("hi");
  // gamestate.join("hello");
  // console.log(gamestate.guessWord('hello', "hi"));
  // console.log(gamestate.guessWord('dolls', "hello"));

})
