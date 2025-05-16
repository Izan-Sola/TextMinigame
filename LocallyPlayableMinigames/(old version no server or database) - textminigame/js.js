

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
  
  //sendDatabaseUpdate(score, 0, "updateScoreList1");

    $('.namePrompt').css('visibility', 'visible'); 
  fillGrid();

  $(document).on('keydown', function(k) {
  k.stopPropagation();

    if( $('.container').css('visibility') == 'visible') {

        if (k.key == 'ArrowLeft' && position != 0) move(position-=1)
        else if (k.key == 'ArrowRight' && position != 53) move(position+=1)
        else if (k.key == 'ArrowUp' && position != 0) move(position-=9) 
        else if (k.key == 'ArrowDown' && position != 53) move(position+=9)
        
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


function move(position) {

  console.log(position)
  if (!(position > grid.length) && !(position < grid.length - grid.length - 1)) {

    if (grid[position] == '@') {
        clearInterval(bombInterval)
        clearInterval(coinInterval)
        grid.length = 0;
        grid.push('You touched a bomb! You lost.')
        //sendDatabaseUpdate(score, coins, "newMaxScore1", "")
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


