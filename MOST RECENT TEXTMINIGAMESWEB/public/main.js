
$(document).ready(function () {
  totalPoints = 0
  //First row are ranks for minigame 1, second row for minigame 2
  ranks = ['(Newbie)', '(Advanced)', '(Expert)', '(GODLIKE)',
           '[unranked]', '[Starter]', '[Elusive]', '[Evasive]', '[UNTOUCHABLE]'
  ]


    $('input').on('mousedown', function(b) {
        b.stopPropagation();

    if (this.id == 'enterName') { 
      playerName = $('#name').val();
       sendDatabaseUpdate(score, coins, "newPlayer", playerName);
       $('.namePrompt').css('visibility', 'hidden'); 
   
    }
    if (this.id == 'noNewUser') { 
      $('.namePrompt').css('visibility', 'hidden'); 
    }
    if(this.id == 'switchGame') {

        if($('.game1').css('visibility') == 'visible'){
      
            sendDatabaseUpdate(totalPoints, coins, "updateScoreList2", "")
        
            $('.game2').css('visibility', 'visible')
            $('.game1').css('visibility', 'hidden')
            $('.mainButtons').css('margin-top', '50px')
            $('.scoresContainer').css('margin-top', '-515px')
          
        }
        else if($('.game1').css('visibility') == 'hidden') {
          sendDatabaseUpdate(score, coins, "updateScoreList", "")
            $('.game2').css('visibility', 'hidden')
            $('.game1').css('visibility', 'visible')
            $('.mainButtons').css('margin-top', '0px')
            $('.scoresContainer').css('margin-top', '-460px')
        }
    }

    if(this.id == 'start' && $('.game1').css('visibility') == 'visible') {
        $('.scoreCounter').html('<b>Current Score: 0</b>');
        fillGrid();
        coinInterval = setInterval(coinSpawn, 2000);
        bombInterval = setInterval(bombSpawn, 4000);
    }
    
    if (this.id == 'start' && $('.game2').css('visibility') == 'visible') {
        start();
        shootLaserInterval = setTimeout(setAttackPositions, atkSpeed)
        pointsInterval = setInterval(points, 1000)
        updateLasers = setInterval(lasers, 6500)
        updateLaserAmount = setInterval(increaseLasers, 13000)
    }

    
  if(this.id == 'scoreListButton' && $('.game1').css('visibility') == 'visible') {
    sendDatabaseUpdate(score, coins, "updateScoreList", "");
  }
  else if(this.id == 'scoreListButton' && $('.game2').css('visibility') == 'visible') {
    sendDatabaseUpdate(totalPoints, coins, "updateScoreList2", "");
  }})
});

//TODO: Add a simple chat

function sendDatabaseUpdate(score, coins, action, name) {
    fetch('https://monthly-devoted-pug.ngrok-free.app/databaseupdates', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        score: score,
        coins: coins,
        action: action,
        name: name
      })
    })
  
    .then(response => response.json())
    .then(data => {
      if (action == "updateScoreList") {    
        $('.scoresContainer').html(''); 
      globalScores = [];
  
        data.scores.forEach(rows => {
  
          switch (true) {
            case (rows.score <= 10):
                userRank = ranks[0];
                break;
            case (rows.score <= 21):
                userRank = ranks[1];
                break;
            case (rows.score <= 29):
                userRank = ranks[2];
                break;
            default:
                userRank = ranks[3];
                break;
        }
          $('.scoresContainer').append(`<li>`+userRank+` Player: ${rows.pname} --- Score: ${rows.score}</li>`);
          globalScores.push(rows.score);
          maxScoreGlobal = Math.max(...globalScores) 
          
          if(rows.score >= maxScoreGlobal) {
            bestPlayerName = rows.pname;
           $('.bestPlayer').html(`<p>Best Player: ` +bestPlayerName+  ` with ` +maxScoreGlobal+  ` points</p> `)
          }     
          if(rows.pname == data.playerName) {
                      
          $('.container').html('<h3 class="highestScore">Highest: '+rows.score+'</h3>')
          $('.container').append('<p class="scores">0--10 = Newbie</p>')
          $('.container').append('<p class="scores">11--21 = Advanced</p>')
          $('.container').append('<p class="scores">22--29 = Expert</p>')
          $('.container').append('<p class="scores">30+ = GODLIKE</p>')
            if(score > rows.score) {
            sendDatabaseUpdate(score, coins, "newMaxScore", rows.pname);
            }
          }
        })
        $('.scoresContainer').append(`<p> You might have to click twice for the scores to update</p>`);
        }
        else if (action == "updateScoreList2") {
          $('.scoresContainer').html(''); 
          globalScores = [];
          data.scores.forEach(rows => {
          switch (true) {
            case (rows.score2 <= 350):
                userRank = ranks[5];
                break;
            case (rows.score2 <= 525):
                userRank = ranks[6];
                break;
            case (rows.score2 <= 650):
                userRank = ranks[7];
                break;
            case (rows.score2 > 649):
                userRank = ranks[8];
                break; 
            default:
                userRank = ranks[4];
                break;
        }
        $('.scoresContainer').append(`<li> ${userRank} Player: ${rows.pname} - Score: ${rows.score2} Coins: ${rows.coins}</li>`);
        globalScores.push(rows.score2);
        maxScoreGlobal = Math.max(...globalScores) 
        
        if(rows.score2 >= maxScoreGlobal) {
          bestPlayerName = rows.pname;
         $('.bestPlayer').html(`<p>Best Player: ${bestPlayerName} with ${maxScoreGlobal} points and ${rows.coins} coins</p>` );
        }     
        if(rows.pname == data.playerName) {
                    
        $('.container2').html('<h3 class="highestScore">Highest: '+rows.score2+'</h3>')
        $('.container2').append('<p class="scores">+150 = Starter</p>')
        $('.container2').append('<p class="scores">+350 = Elusive</p>')
        $('.container2').append('<p class="scores">+525 = Evasive</p>')
        $('.container2').append('<p class="scores">+650 = UNTOUCHABLE</p>')
          if(score > rows.score2) {
          sendDatabaseUpdate(totalPoints, coins, "newMaxScore2", rows.pname);
          }
        }
          })}
        else {
        console.log('Response from server:', data);
      }
    })
    .catch(error => {
      console.error('Error in database operation:', error);
    });
  }
  
  
  