const fs = require('fs')

class Gamestate{
  
  constructor(){
      
    this.wordlist = fs.readFileSync('./src-server/official_word_list.txt', 'utf8').split('\r\n');
    this.allowedWordlist =  fs.readFileSync('./src-server/official_allowed_gusses.txt', 'utf8').split('\r\n');

    this.goNext();
    this.players = [];
    setInterval(this.tick, 1000);

    
    
  }

  tick(){
    this.countdown -= 1;
    if (this.countdown == 0){
      // logic
    }
  }


  goNext(){
    var index = Math.floor(Math.random() * this.wordlist.length);
    this.word = this.wordlist[index];
    this.orange = [];
    this.green = ['0', '0', '0', '0', '0'];
    this.black = [];
    this.history = [];
    this.countdown = 15;
    this.currentPlayer = 0;
    this.players = [];
  }

  nextTurn(){
    this.countdown = 15;



  }


}

module.exports = Gamestate;