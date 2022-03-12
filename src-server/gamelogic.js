const { count } = require('console');
const fs = require('fs')

class Gamestate{
  
  constructor(){
      
    this.wordlist = fs.readFileSync('./src-server/official_word_list.txt', 'utf8').split('\r\n');
    this.allowedWordlist =  fs.readFileSync('./src-server/complete_word_list.txt', 'utf8').split('\r\n');

    this.goNext();
    this.players = [];
    
    this.currentPlayer = -1;
    this.players = [];
    this.playerLives = [];
    this.countdown = 0;
    setInterval(this.tick.bind(this), 1000);
  }

  tick(){
    this.countdown -= 1;
    if (this.countdown <= 0){
      // logic
      this.bomb();
      this.nextTurn();
    }
  }


  goNext(){
    var index = Math.floor(Math.random() * this.wordlist.length);
    this.word = this.wordlist[index];
    this.word = "truce"
    this.yellow = [[], [], [], [], []];
    this.green = ['0', '0', '0', '0', '0'];
    this.black = [];
    this.history = [];
    this.score = [];
    this.idcnt = 0;
  }

  nextTurn(){
    this.countdown = 15;
    this.currentPlayer ++;
    this.currentPlayer %= this.players.length;
  }

  bomb(){
    if (this.currentPlayer == -1){
      return;
    }
    --this.playerLives[this.currentPlayer];
    if (this.playerLives[this.currentPlayer] == 0){
      this.playerLives.splice(this.currentPlayer, 1);
      this.players.splice(this.currentPlayer, 1);
      this.score.splice(this.currentPlayer, 1);
      this.currentPlayer--;
    }
  }

  join(newID){
    this.players.push(newID);
    this.playerLives.push(3);
    this.score.push(0);
    if (this.currentPlayer == -1){
      this.nextTurn();
    }
  }

  snapshot(){
    return {history : this.history, playerData : [this.players, this.playerLives, this.score], current : this.currentPlayer};
  }

  guessWord(Guessedword, uid){
    if (uid != this.players[this.currentPlayer]) return 0;
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
        this.bomb(this.currentPlayer);
        this.nextTurn();
        return 0;
      }

      var feedback = ['B', 'B', 'B', 'B', 'B'];
      var wordCopy = this.word.split("");
      Guessedword = Guessedword.split("");


      for (var i = 0; i < 5; i++){
        if (Guessedword[i] == wordCopy[i]) {
          feedback[i] = 'G';
          wordCopy[i] = '0';
        }
      }


      for (var i = 0; i < 5; i++){
        if (feedback[i] == 'B'){
          for(var j = 0; j < 5; j++){
            if (Guessedword[i] == wordCopy[j]){
              feedback[i] = 'Y';
              wordCopy[j] = '0';
              break;
            }
          }
        }
      }

      for (i = 0; i < 5; i++){
        if (feedback[i] == 'G'){
          this.green[i] = this.word[i];
        } else if (feedback[i] == 'Y'){
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
        this.score[this.currentPlayer]++;
        
        this.playerLives[this.currentPlayer]++;
        if (this.playerLives[this.currentPlayer] > 3) {
          this.playerLives[this.currentPlayer] = 3;
        }
        this.goNext();
      }
      this.nextTurn();
      return [Guessedword, feedback];
    }
  }
}

module.exports = Gamestate;