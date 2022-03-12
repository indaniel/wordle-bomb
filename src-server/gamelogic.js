const { count } = require('console');
const fs = require('fs')

class Gamestate{
  
  constructor(){
      
    this.wordlist = fs.readFileSync('./src-server/official_word_list.txt', 'utf8').split('\r\n');
    this.allowedWordlist =  fs.readFileSync('./src-server/complete_word_list.txt', 'utf8').split('\r\n');

    this.goNext();

    this.players = {};
    this.queue = [];
    
    this.countdown = 0;
    
    setInterval(this.tick.bind(this), 1000);
  }

  tick(){
    this.countdown -= 1;
    if (this.countdown <= 0){
      // logic
      if (this.players[this.queue[0]] === false) {
        // player did not respond to ping, remove from game
        delete this.players[this.queue[0]]
        this.queue.shift()
        this.nextTurn(false);
      } else {
        this.bomb();
        this.nextTurn();
      }
    }
  }


  goNext(){
    var index = Math.floor(Math.random() * this.wordlist.length);
    this.word = this.wordlist[index];
    this.yellow = [[], [], [], [], []];
    this.green = ['0', '0', '0', '0', '0'];
    this.black = [];
    this.history = [];
  }

  nextTurn(needsShift=true){
    this.countdown = 15;

    if (this.queue.length !== 0) {
      if (needsShift) {
        this.queue.push(this.queue.shift());
      }
      this.players[this.queue[0]].alive = false;
    }
  }

  bomb(){
    if (this.queue.length === 0){
      return;
    }
    --this.players[this.queue[0]].lives;
    if (this.players[this.queue[0]].lives === 0){
      this.players[this.queue[0]].score = 0;
      this.players[this.queue[0]].lives = 3;
    }
  }

  join(newID){
    this.players[newID] = {
      id : newID,
      lives : 3,
      score  : 0, 
      highscore : 0,
      alive: false
    };

    if (this.queue.length == 0) {
      this.countdown = 15;
    }
    this.queue.push(newID);
  }

  snapshot(){
    return {history : this.history, playerData : this.players, current : this.queue[0], queue: this.queue};
  }

  stayAlive(uid) {
    if (uid in this.players) {
      this.players[uid].alive = true;
    }
    this.players[uid]
  }

  guessWord(Guessedword, uid){
    console.log(this.word);
    if (uid != this.players[this.queue[0]].id) return 0;
    else{
      var flag = 1;
      for (var i = 0; i < 5; ++i){
        if (this.green[i] != Guessedword[i] && this.green[i] != '0') flag = 0;
      }
      
      for (var i = 0; i < 5; ++i){
        if (this.black.includes(Guessedword[i])){
          flag = 0;
        }
      }
      
      for (var i = 0; i < 5; ++i){
        if (this.yellow[i].includes(Guessedword[i])) flag = 0;  
      }

      if (!(this.allowedWordlist.includes(Guessedword))){
        flag = 0;
      }

      if (!flag) {
        this.bomb();
        // this.nextTurn();
        // return 0;
      }

      var feedback = ['black', 'black', 'black', 'black', 'black'];
      var wordCopy = this.word.split("");
      Guessedword = Guessedword.split("");


      for (var i = 0; i < 5; i++){
        if (Guessedword[i] == wordCopy[i]) {
          feedback[i] = 'green';
          wordCopy[i] = '0';
        }
      }


      for (var i = 0; i < 5; i++){
        if (feedback[i] == 'black'){
          for(var j = 0; j < 5; j++){
            if (Guessedword[i] == wordCopy[j]){
              feedback[i] = 'yellow';
              wordCopy[j] = '0';
              break;
            }
          }
        }
      }

      for (i = 0; i < 5; i++){
        if (feedback[i] == 'green'){
          this.green[i] = this.word[i];
        } else if (feedback[i] == 'yellow'){
          this.yellow[i].push(Guessedword[i]);
        } else {
          if (!(this.word.includes(Guessedword[i]))){
            this.black.push(Guessedword[i]);
          } else {
            this.yellow[i].push(Guessedword[i]);
          }
        }
      }

      this.history.push([Guessedword, feedback]);
      if (this.word == Guessedword){
        this.players[uid].score++;
        this.players[uid].highscore = Math.max(this.players[uid].highscore, this.players[uid].score);
        this.players[uid].lives = Math.min(this.players[uid].lives+1, 3);

        this.goNext();
      }
      this.nextTurn();
      return [Guessedword, feedback, flag];
    }
  }
}

module.exports = Gamestate;