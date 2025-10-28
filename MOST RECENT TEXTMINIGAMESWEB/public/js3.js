import { Random } from 'https://cdn.skypack.dev/random-js';
const random = new Random();
import { sendDatabaseUpdate } from "./main.js";
export { start3 }

let container;
let grid3;
let start;
let playerStart;
let playerEnd;
let currentPosition;
let coinPosition;
let currentTime;
let t;
let l;
let totalPoints;
let end;
let coins;
let points;
let barrierChance;
let coinChance;
let coinPos;
let incomingDeathDelay;
let previousIncomingDeathDelay; 
let row;
let timerInterval;
let incomingDeathInterval;
let position;
let pastPosition;
let startTime; 

function endRound() {
    clearInterval(timerInterval)
    clearInterval(incomingDeathInterval)


    const endTime = Date.now();

    const timeLastedSeconds = Math.floor((endTime - startTime) / 1000); 
    
    totalPoints = points + (timeLastedSeconds * 1.10);

    console.log(`Game Over! Time Lasted: ${timeLastedSeconds}s. Base Points: ${points}. Total Score: ${totalPoints}`);

    sendDatabaseUpdate(totalPoints, coins, "newMaxScore3", "")
}

function fillGrid3() {
    container = $('.container3')
    container.html('')
    grid3 = container.text().split('')
    start = random.integer(0, 8)
    playerStart = start
    playerEnd = 0
    currentPosition = playerStart
    coinPosition = null

    for (let j = 0; j < 6; j++) {
        end = random.integer(0, 8)

        for (let y = 0; y < 9; y++) {

            if (y != start) {

               (coinPosition != null && coinPosition == y) ? (grid3.push('Φ'), coinPosition = null) : grid3.push('X')
            } 
            else if (random.integer(barrierChance, 8) == barrierChance) grid3.push('═')
            else grid3.push('O')
        }

        for (let i = 0; i < 9; i++) {
            
            if ((i >= start && i <= end) || (i <= start && i >= end)) {
                grid3.push('O')
                
                l = grid3.length
                if (grid3[l - 10] == 'Φ' && grid3[l - 19] == 'O') grid3[l - 10] = 'X'
                if (j == 5) playerEnd = grid3.length - 1
            } else grid3.push('X')
            
            if (i > start && i < end) random.integer(coinChance, 4) == coinChance ? coinPosition = i : coinPosition = null
        }

        start = end
    }

    grid3[playerStart] = '+'
    container.html(grid3)
    console.log(playerEnd, grid3[playerEnd])
}

function start3() {
    currentTime = 60
    t = currentTime
    coins = 0
    points = 0
    barrierChance = 1
    coinChance = 1
    coinPos = null
    incomingDeathDelay = 1500
    previousIncomingDeathDelay = 1500; 
    row = 0
    startTime = Date.now(); 

    $('.timer-points3').html(
        'Time left: ' + currentTime + ' (s)' +
        ' Points: ' + points +
        ' Coins: ' + coins +
        '<br> Barrier frequency: ' + barrierChance +
        ' Paths completed: ' + 0 +
        ' Incoming Death Delay: ' + incomingDeathDelay
    )
    fillGrid3()
    timerInterval = setInterval(timer, 1000)
    incomingDeathInterval = setInterval(incomingDeath, incomingDeathDelay)
}


function incomingDeath() {
    for (let i = 9 * row; i < 9 * row + 9; i++) {
        if(grid3[i] == '+') {
            container.html('You were too slow!')
            endRound(); 
            break;
        }
        grid3[i] = 'V'
        container.html(grid3)
    }
    console.log(incomingDeathDelay)

    row += 1
}

function timer() {
    currentTime -= 1

    if (currentTime % 8 == 0) barrierChance += 1
    else if (currentTime % 16 == 0) coinChance += 1
    else if (currentTime % 4 == 0 && incomingDeathDelay > 799) incomingDeathDelay -= 150

    // Check if the delay has been changed and needs updating
    if (incomingDeathDelay !== previousIncomingDeathDelay) {
        clearInterval(incomingDeathInterval);
        incomingDeathInterval = setInterval(incomingDeath, incomingDeathDelay);
        previousIncomingDeathDelay = incomingDeathDelay;
    }

    $('.timer-points3').html(
        'Time left: ' + currentTime + ' (s)' +
        ' Points: ' + points +
        ' Coins: ' + coins +
        '<br> Barrier frequency: ' + barrierChance +
        ' Paths completed: ' + 0 +
        ' Incoming Death Delay: ' + incomingDeathDelay
    )

    if (currentTime == 0) endRound()
}

$(document).on('keydown', function(k) {

if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(k.key)) {
    k.preventDefault();
}
    if( $('.container3').css('visibility') == 'visible' ) {
        position = currentPosition
        pastPosition = position

        if (coinPos != null) grid3[coinPos] = 'O'

        switch (k.key) {
            case 'ArrowUp': position -= 9; break       
            case 'ArrowLeft': position -= 1; break
            case 'ArrowDown': position += 9; break
            case 'ArrowRight': position += 1; break
            case ' ': if (grid3[position + 9] == '═') position += 18
        }

        if (k.key != ' ' && grid3[position] == '═') position = pastPosition

        if (position == playerEnd) {
            
            fillGrid3()
            
            points += 15 + (currentTime * 1.10); 
            
            // Clear and reset interval here too, using the currently set delay
            clearInterval(incomingDeathInterval)
            incomingDeathInterval = setInterval(incomingDeath, incomingDeathDelay)
            row = 0

        } else if (!(position > grid3.length) && !(position < 0)) {

            switch (grid3[position]) {
                case 'X':
                    container.html('You stepped out of the path!')
                    endRound()
                    break
                case 'O':
                    grid3[currentPosition] = 'O'
                    grid3[position] = '+'
                    container.html(grid3)
                    break
                case 'Φ':
                    coinPos = grid3.indexOf('Φ')
                    grid3[currentPosition] = 'O'
                    grid3[position] = '+'
                    container.html(grid3)
                    
                    points += 2; 
                    coins += 1;
                    break
            }
            currentPosition = position
        }
    }
})
