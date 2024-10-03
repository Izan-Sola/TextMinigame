
function fillGrid() {


  restart = false
  coinCount = 0
  position = 0
  currentPosition = 0
  score = 0
  moves = 5
  swap = 0;
grid = ['+', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O',
        'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O',
        'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O',
        'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O',
        'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O',
        'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O']; 

        $('.container').html(grid);
}
window.addEventListener("keydown", function(e) {
  if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
      e.preventDefault();
  }
}, false);

$(document).ready(function() {
  coins = 0
  sendDatabaseUpdate(score, coins, "updateScoreList");
 
  effectInterval = setInterval(effect, 750);
swap = 0
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
        //sendDatabaseUpdate(score, coins, "updateScoreList", "")
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


function effect() {

if(swap == 0) {
	$('.bestPlayer').css('border', 'dotted');
  swap = 1
  
}
else if(swap == 1){
	$('.bestPlayer').css('border', 'dashed');
  swap = 0
}

}