import { fillGrid } from './js.js';
import { start } from './js2.js';
import { start3 } from './js3.js';
export { sendDatabaseUpdate };

let playerName = '';
let score = 0;
let coins = 0;
let ranks = ['(Newbie)', '(Advanced)', '(Expert)', '(GODLIKE)',
           '[unranked]', '[Starter]', '[Evasive]', '[Elusive]', '[UNTOUCHABLE]',
           '{Short Legged}', '{Average}', '{Sprinter}', '{Speed Runner}'];

let globalScores = [];
let maxScoreGlobal = 0;
let bestPlayerName = '';
let maxScore = 0;


function resetGlobalScore() {
    globalScores = [];
    maxScoreGlobal = 0;
    bestPlayerName = '';
    $('.bestPlayer').html('');
}


function sendDatabaseUpdate(score, coins, action, name) {
    fetch('http://textminigames.duckdns.org/databaseupdates', {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            score,
            coins,
            action,
            name
        })
    })
    .then(response => response.json())
    .then(data => {
        $('.scoresContainer').html('');
        
        if (action.includes("updateScoreList")) {
            resetGlobalScore();
        }

        if (action === "updateScoreList1") {
            data.scores.forEach(rows => {
                let userRank = '';
                switch (true) {
                    case (rows.score1 <= 10): userRank = ranks[0]; break;
                    case (rows.score1 <= 21): userRank = ranks[1]; break;
                    case (rows.score1 <= 29): userRank = ranks[2]; break;
                    default: userRank = ranks[3]; break;
                }

                $('.scoresContainer').append(`<li>${userRank} Player: ${rows.pname} --- Score: ${rows.score1}</li>`);
                newMaxScoreGlobal(rows.pname, rows.score1, rows.coins)

                if (rows.pname === data.playerName) {
                    $('.container').html('<h3 class="highestScore">Highest: ' + rows.score1 + '</h3>');
                    $('.container').append('<p class="scores">0--10 = Newbie</p>');
                    $('.container').append('<p class="scores">11--21 = Advanced</p>');
                    $('.container').append('<p class="scores">22--29 = Expert</p>');
                    $('.container').append('<p class="scores">30+ = GODLIKE</p>');

                    if (score > rows.score1) {
                        sendDatabaseUpdate(score, coins, "newMaxScore1", rows.pname);
                        maxScore = score;
                    }
                }
            });
            $('.scoresContainer').append(`<p>You might have to click twice for the scores to update</p>`);
        }

        else if (action === "updateScoreList2") {
            $('.scoresContainer').html('');
            
            data.scores.forEach(rows => {
                let userRank = '';
                  switch (true) {
                    case (rows.score2 >= 600): userRank = ranks[8]; break; 
                    case (rows.score2 >= 400): userRank = ranks[7]; break; 
                    case (rows.score2 >= 250): userRank = ranks[6]; break; 
                    case (rows.score2 >= 100): userRank = ranks[5]; break; 
                    default: userRank = ranks[4]; break; 
                }


                $('.scoresContainer').append(`<li>${userRank} Player: ${rows.pname} - Score: ${rows.score2} Coins: ${rows.coins}</li>`);
                newMaxScoreGlobal(rows.pname, rows.score2, rows.coins)

                if (rows.pname === data.playerName) {
                    $('.container2').html('<h3 class="highestScore">Highest: ' + rows.score2 + '</h3>');
                    $('.container2').append('<p class="scores">+100 = Starter</p>');
                    $('.container2').append('<p class="scores">+250 = Evasive</p>');
                    $('.container2').append('<p class="scores">+400 = Elusive</p>');
                    $('.container2').append('<p class="scores">+600 = UNTOUCHABLE</p>');

                    if (score > rows.score2) {
                        sendDatabaseUpdate(score, coins, "newMaxScore2", rows.pname);
                        maxScore = score;
                    }
                }
            });
        }
        else if (action === "updateScoreList3") {

            data.scores.forEach(rows => {
                let userRank = '';
                switch (true) {
              
                    case (rows.score3 > 600): userRank = ranks[12]; break;
                    case (rows.score3 >= 400): userRank = ranks[11]; break; 
                    case (rows.score3 >= 250): userRank = ranks[10]; break;
                    case (rows.score3 >= 100 && rows.score3 > 0): userRank = ranks[9]; break; 
                    default: userRank = ranks[9]; 
                }
              $('.scoresContainer').append(`<li>${userRank} Player: ${rows.pname} - Score: ${rows.score3} Coins: ${rows.coins}</li>`);
                 newMaxScoreGlobal(rows.pname, rows.score3, rows.coins)
                if (rows.pname === data.playerName) {
                    $('.container3').html('<h3 class="highestScore">Highest: ' + rows.score3 + '</h3>');
                    $('.container3').append('<p class="scores">+100 = Short Legged</p>');
                    $('.container3').append('<p class="scores">+250 = Average</p>');
                    $('.container3').append('<p class="scores">+400 = Sprinter</p>');
                    $('.container3').append('<p class="scores">+600 = Speed-Runner</p>');

                    if (score > rows.score3) {
                        sendDatabaseUpdate(score, coins, "newMaxScore3", rows.pname);
                        maxScore = score;
                    }
                }
            });
        }

        else {
            console.log('Response from server:', data);
        }
    })
    .catch(error => {
        console.error('Error in database operation:', error);
    });
}

function newMaxScoreGlobal(pname, score, coins) {

    if (score >= maxScoreGlobal) {
        maxScoreGlobal = score;
        bestPlayerName = pname;

        $('.bestPlayer').html(`<p>Best Player: ${bestPlayerName} with ${maxScoreGlobal} points and ${coins} coins</p>`);
    }

}

$(document).ready(function () {
  const effectInterval = setInterval(effect, 750);
    $('input').on('mousedown', function (b) {
        b.stopPropagation();
  

      //^^^^^Replace the button in html with a list containing the 3 minigames replace js with:
        
          switch (this.id) {

                case 'enterName':
                      playerName = $('#name').val();
                      sendDatabaseUpdate(0, 0, "newPlayer", playerName);
                      $('.namePrompt').css('visibility', 'hidden'); break

                case 'noNewUser':
                      $('.namePrompt').css('visibility', 'hidden'); break
                
                case 'showGame1':
                      sendDatabaseUpdate(0, 0, "updateScoreList1", "")
                      $('#game2').css('visibility', 'hidden')
                      $('#game3').css('visibility', 'hidden')
                      $('#game1').css('visibility', 'visible')
                      $('.mainButtons').css('margin-top', '0px')
                      $('.scoresContainer').css('margin-top', '-500px'); break

                case 'showGame2':
                      sendDatabaseUpdate(0, 0, "updateScoreList2", "")
                      $('#game2').css('visibility', 'visible')
                      $('#game3').css('visibility', 'hidden')
                      $('#game1').css('visibility', 'hidden')
                      $('.mainButtons').css('margin-top', '70px')
                      $('.scoresContainer').css('margin-top', '-500px'); break

                case 'showGame3':
                      sendDatabaseUpdate(0, 0, "updateScoreList3", "")
                      $('#game2').css('visibility', 'hidden')
                      $('#game3').css('visibility', 'visible')
                      $('#game1').css('visibility', 'hidden')
                      $('.mainButtons').css('margin-top', '100px'); 
                      $('.scoresContainer').css('margin-top', '-600px'); break
                      

                case 'start':
                      if($('#game1').css('visibility') == 'visible') {
                              $('.scoreCounter').html('<b>Current Score: 0</b>')
                              fillGrid()
                      }
                      else if ($('#game2').css('visibility') == 'visible') {
                              start()
                      }
                      else if ($('#game3').css('visibility') == 'visible') {
                              start3()
                      }
                      break
               case 'scoreListButton':
                 
                       if($('#game1').css('visibility') == 'visible')  sendDatabaseUpdate(score, coins, "updateScoreList1", "")
                       if($('#game2').css('visibility') == 'visible')  sendDatabaseUpdate(score, coins, "updateScoreList2", "")
                       if($('#game3').css('visibility') == 'visible')  sendDatabaseUpdate(score, coins, "updateScoreList3", "")
                        break
              }
                       
        })
});

function effect() {
           const borderType = $('.bestPlayer').css('border').split(' ')[1]
           if(borderType == 'dashed') $('.bestPlayer').css('border', 'dotted');
           else $('.bestPlayer').css('border', 'dashed');
}
