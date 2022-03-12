const { count } = require('console');
const fs = require('fs')

class Gamestate{
  
  constructor(forceTurn){
      
    this.wordlist = fs.readFileSync('./src-server/official_word_list.txt', 'utf8').split('\n').map(x => x.trim());
    this.allowedWordlist =  fs.readFileSync('./src-server/complete_word_list.txt', 'utf8').split('\n').map(x => x.trim());


    console.log("WORDLISTS")
    console.log(this.wordlist.length)
    console.log(this.allowedWordlist.length)

    this.forceTurn = forceTurn;
    this.players = {};
    this.countdown = 0;
    this.queue = []
    this.history = []
    
    setInterval(this.tick.bind(this), 1000);
    this.goNext();
  }

  tick(){
    this.countdown -= 1;
    if (this.countdown <= 0){
      // logic
      if (this.queue.length && this.players[this.queue[0]].alive === false){ 
        delete this.players[this.queue[0]]
        this.queue.shift();
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
    this.history.push({
      type: "new"
    });
  }

  nextTurn(needsShift=true){
    this.countdown = 15;

    if (this.queue.length !== 0) {
      if (needsShift) {
        this.queue.push(this.queue.shift());
      }
      this.players[this.queue[0]].alive = false;

    }
    this.forceTurn()
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

    var keymaps = {};

    for (var i = 0; i < 5; i++){
      for (var j = 0; j < this.yellow[i].length; j++){
        keymaps[this.yellow[i][j]] = "yellow";
      }
    }
    
    for (var i = 0; i < 5; i++){
      if (this.green[i] != '0'){
          keymaps[this.green[i]] = "green";
      }
    }

    for(var i = 0; i < this.black.length; i++){
      keymaps[this.black[i]] = "black";
    }

    return {history : this.history.slice(-10), playerData : this.players, current : this.queue[0], queue: this.queue, keymaps : keymaps};
  }

  stayAlive(uid) {
    if (uid in this.players) {
      this.players[uid].alive = true;
    }
    this.players[uid]
  }

  guessWord(Guessedword, uid){
    // console.log(this.word);
    if (uid != this.players[this.queue[0]].id) {
      console.log("not this player's turn")
      return 0;
    } else{
      var flag = 1;

      if (!(this.allowedWordlist.includes(Guessedword))){
        console.log("flagged illegal", Guessedword)
        flag = 0;
      }
      var wordCopy = this.word.split("");
      var GuessedwordCopy = Guessedword;
      Guessedword = Guessedword.split("");
  
      for (var i = 0; i < 5; ++i){
        if (this.green[i] != Guessedword[i] && this.green[i] != '0') {
          console.log("flagged green", i, Guessedword[i])
          flag = 0;
        }
      }
      
      for (var i = 0; i < 5; ++i){
        if (this.black.includes(Guessedword[i])){
          flag = 0;
          console.log("flagged black", i, Guessedword[i])
        }
      }
      
      for (var i = 0; i < 5; ++i){
        if (this.yellow[i].includes(Guessedword[i])) {
          flag = 0; 
          console.log("flagged yellow", i, Guessedword[i])
        }  
      }

      var feedback = ['black', 'black', 'black', 'black', 'black'];


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

      this.history.push({
        type: "guess",
        data: [
          [Guessedword[0], feedback[0]],
          [Guessedword[1], feedback[1]],
          [Guessedword[2], feedback[2]],
          [Guessedword[3], feedback[3]],
          [Guessedword[4], feedback[4]],
        ]
      });
      console.log(this.word.split(""));
      console.log(Guessedword);
      
      if (this.word == GuessedwordCopy){
        this.players[uid].score++;
        this.players[uid].highscore = Math.max(this.players[uid].highscore, this.players[uid].score);
        this.players[uid].lives = Math.min(this.players[uid].lives+1, 3);

        this.goNext();
        
      }

      if (!flag) {
        this.bomb();
        // this.nextTurn();
        // return 0;
      }
      this.nextTurn();
      return [Guessedword, feedback, flag];
    }
  }
}

module.exports = Gamestate;