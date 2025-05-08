function fillGrid() {
  position = 0
  currentPosition = 0
  score = 0
  moves = 5

grid = ['+', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O',
        'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O',
        'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O',
        'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O',
        'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O',
        'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O']; 

        $('.container').html(grid);
}

function test() {
  if(grid.length > maxLength) {
    grid.pop();
  }
}
$(document).ready(function() {

  fillGrid();

  $('input').on('mousedown', function(event){
    event.stopPropagation();

  if(this.id == 'start') {
      score=0
      $('.scoreCounter').html('<b>Current Score: 0</b>');
      fillGrid();
      coinInterval = setInterval(coinSpawn, 2000);
      bombInterval = setInterval(bombSpawn, 4000);
      testInterval = setInterval(test, 1000);
  }

  if(this.id == 'pause') {
    clearInterval(bombInterval)
    clearInterval(coinInterval)
  }

  if(this.id == 'scoreListButton') {

    scores = [];
    for(i=1; i<=4; i++) {
      if(localStorage.getItem('score'+i) !== null) {
          scores.push(localStorage.getItem('score'+i));
      }
    }
    
    maxScore = Math.max(...scores);
    if(maxScore > localStorage.getItem('maxScore')) {
         localStorage.setItem('maxScore', maxScore)
    }

    $('.container').html('<h3 class="highestScore">Highest: '+localStorage.getItem('maxScore')+'</h3>')
    
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
    score=0;
  }
  })

  $(document).on('keydown', function(k) {

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
  })
})


function saveScore() {
    for(i=1; i<4; i++) {
      if(localStorage.getItem('score'+i) === null) {
         localStorage.setItem('score'+i, score);
         break;
      }
    }
}

function coinSpawn() {

  min = Math.ceil(2);
  max = Math.floor(grid.length - 1);
  dotPos = Math.floor(Math.random() * (max - min + 1)) + min;

  grid.forEach(function(element, index, array) {
    if (dotPos != currentPosition) {

      grid[dotPos] = '*';
      $('.container').html(grid);
    }
  })
}

function bombSpawn() {
  min = Math.ceil(0);
  max = Math.floor(grid.length - 1);
  bombPos = Math.floor(Math.random() * (max - min + 1)) + min;

  if (bombPos != currentPosition) {
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
      break;

    case 'down':
      position = position + 9
      break;

  }
  if (!(position > grid.length) && !(position < grid.length - grid.length - 1)) {

    if (grid[position] == '@') {
       // clearInterval(mvBombInterval)
        clearInterval(bombInterval)
        clearInterval(coinInterval)
        grid.length = 0;
        grid.push('You touched a bomb! You lost.')
        saveScore();
    }

    if (grid[position] == '*') {
        grid[position] = 'O';
        grid.pop();
        maxLength = grid.length
        score += 1;
        $('.scoreCounter').html('<b>Current Score: ' + score + '</b>');
    }
    element = grid[currentPosition];
    grid.splice(currentPosition, 1);
    grid.splice(position, 0, element);

    $('.container').html(grid);
    currentPosition = position;
  }
}