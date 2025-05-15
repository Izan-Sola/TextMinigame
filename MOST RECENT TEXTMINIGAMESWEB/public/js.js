import { sendDatabaseUpdate } from './main.js'
export { fillGrid }
export { coinSpawn }

let restart, coinCount, position, currentPosition, score, moves, coins, grid;
let min, max, dotPos, bombPos, maxLength;
let element;
let coinInterval, bombInterval;

function fillGrid() {
  coinInterval = setInterval(coinSpawn, 2000);
  bombInterval = setInterval(bombSpawn, 4000);
  restart = false
  coinCount = 0
  position = 0
  currentPosition = 0
  score = 0
  moves = 5
  coins = 0
  grid = ['+', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O',
        'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O',
        'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O',
        'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O',
        'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O',
        'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O']; 

  $('.container').html(grid);
}



$(document).ready(function() {
  
  sendDatabaseUpdate(score, 0, "updateScoreList1");

    $('.namePrompt').css('visibility', 'visible'); 
  fillGrid();

   /*   Useless feature, replaced
    scores = [];
    for(i=1; i<=4; i++) {
      if(localStorage.getItem('score'+i) !== null) {
          scores.push(localStorage.getItem('score'+i));
      }
    }
    maxScore = Math.max(...scores);
    replaced = false;
    for(i=1; i<=4; i++) { 
         
        if(localStorage.getItem('score'+i) == localStorage.getItem('maxScore')) {
            localStorage.removeItem('score'+i)
      }
        if(score > localStorage.getItem('score'+i) && replaced == false) {
          localStorage.setItem('score'+i, score)
          replaced = true;
        }
        if(localStorage.getItem('score'+i) !== null) {
           $('.container').append('<p class="scores">Score: '+localStorage.getItem('score'+i)+'</p>')  
      }
    }
      */

  $(document).on('keydown', function(k) {
k.stopPropagation();
if( $('.container').css('visibility') == 'visible') {
    if (k.key == 'ArrowLeft' && position != 0) {

      move("backward");
    }
    if (k.key == 'ArrowRight' && position != 53) {

      move("forward");
    }
    if (k.key == 'ArrowUp' && position != 0) {

      move("up");
    }
    if (k.key == 'ArrowDown' && position != 53) {

      move("down");
    }
  }
  })
})

function coinSpawn() {

  if(coinCount <=1) {

  min = Math.ceil(2);
  max = Math.floor(grid.length - 2);
  dotPos = Math.floor(Math.random() * (max - min + 1)) + min;

  grid.forEach(function(element, index, array) {
    if (dotPos != currentPosition && grid[dotPos] != '@') {

      grid[dotPos] = '*';
      $('.container').html(grid);
    }
  })
  coinCount+=1
}
}
function bombSpawn() {
  min = Math.ceil(0);
  max = Math.floor(grid.length - 2);
  bombPos = Math.floor(Math.random() * (max - min + 1)) + min;

  if (bombPos != currentPosition && grid[bombPos] != '*') {
    grid[bombPos] = '@';
   // mvBombInterval = setInterval(moveBomb, 2000)
  }
}

/* nope
 grid.shift();
 grid.push("*");
 dot = grid[grid.length-1];
 grid.splice(grid.length-1, 1)
 grid.splice(dotPos, 0, dot)*/

function move(direction) {
  switch (direction) {

    case 'forward':
      position = position + 1
      break;

    case 'backward':
      position = position - 1
      break;

    case 'up':
      position = position - 9
      if(position < 0) {
        position+=9;
      }
      break;

    case 'down':
      position = position + 9
      if(position > grid.length-1) {
        position-=9;
      }
      break;

  }
  console.log(position)
  if (!(position > grid.length) && !(position < grid.length - grid.length - 1)) {

    if (grid[position] == '@') {
        clearInterval(bombInterval)
        clearInterval(coinInterval)
        grid.length = 0;
        grid.push('You touched a bomb! You lost.')
        sendDatabaseUpdate(score, coins, "newMaxScore1", "")
    }

    if (grid[position] == '*') {
        grid[position] = 'O';
        grid.pop();
        maxLength = grid.length
        score += 1;
        $('.scoreCounter').html('<b>Current Score: ' + score + '</b>');
        coinCount-=2;
    }
    element = grid[currentPosition];
    grid.splice(currentPosition, 1);
    grid.splice(position, 0, element);

    $('.container').html(grid);
    currentPosition = position;
  }
}


