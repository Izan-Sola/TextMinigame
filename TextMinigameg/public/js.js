

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
  effectInterval = setInterval(effect, 750);
swap = 0
  if(localStorage.getItem('username') !== null) {
    console.log("userexistsnoask")
    playerName = localStorage.getItem('username')
  }
  else {
    $('.namePrompt').css('visibility', 'visible'); 
  }
  fillGrid();
  sendDatabaseUpdate("", 0, "updateScoreList");
  //sendDatabaseUpdate("", 0, "updateScoreList");
  $('input').on('mousedown', function(event) {
    event.stopPropagation();

    if (this.id == 'enterName') { 
      playerName = $('#name').val();
       sendDatabaseUpdate(playerName, 0, "newPlayer");
       localStorage.setItem('username', playerName)
       $('.namePrompt').css('visibility', 'hidden'); 
   
    }
  if(this.id == 'start') {
      score=0
      $('.scoreCounter').html('<b>Current Score: 0</b>');
      fillGrid();
      coinInterval = setInterval(coinSpawn, 2000);
      bombInterval = setInterval(bombSpawn, 4000);
  }

  if(this.id == 'scoreListButton') {

    if(score > localStorage.getItem('maxScore')) {
         localStorage.setItem('maxScore', score)
       
    }

    $('.container').html('<h3 class="highestScore">Highest: '+localStorage.getItem('maxScore')+'</h3>')
    $('.container').append('<p class="scores">0--10 = Newbie</p>')
    $('.container').append('<p class="scores">11--21 = Advanced</p>')
    $('.container').append('<p class="scores">22+ = Expert</p>')
    if(localStorage.getItem('maxScore') != null) {
    sendDatabaseUpdate(playerName, localStorage.getItem('maxScore'), "newMaxScore");
    sendDatabaseUpdate("", 0, "updateScoreList");
    }

    score=0;
    
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
  
  }
  })

  $(document).on('keydown', function(k) {
k.stopPropagation();
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
  console.log(coinCount)
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
        coinCount-=3;
    }
    element = grid[currentPosition];
    grid.splice(currentPosition, 1);
    grid.splice(position, 0, element);

    $('.container').html(grid);
    currentPosition = position;
  }
}

function sendDatabaseUpdate(name, score, action) {
  fetch('https://5201-2-59-232-141.ngrok-free.app/databaseupdates', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      score: score,
      action: action
    })
  })
  .then(response => response.json())
  .then(data => {
    if (action == "updateScoreList") {
      console.log(data)
      $('.scoresContainer').html(''); // Clear current scores
    globalScores = [];

      data.forEach(rows => {
        $('.scoresContainer').append(`<li>Player: ${rows.pname} --- Score: ${rows.score}</li>`);
        globalScores.push(rows.score);
        maxScoreGlobal = Math.max(...globalScores) 
        
        if(rows.score >= maxScoreGlobal) {
          bestPlayerName = rows.pname;
          console.log(bestPlayerName + maxScoreGlobal)
         $('.bestPlayer').html(`<p>Best Player: ` +bestPlayerName+  ` with ` +maxScoreGlobal+  ` points</p> `)
        }     
      })

    } else {
      console.log('Response from server:', data);
    }
  })
  .catch(error => {
    console.error('Error in database operation:', error);
  });
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