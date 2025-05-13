

function start() {
    hit = false
    newPos = 0
    timertest = 0
    currentPosition = 71
    laserAmount = 1
    t = 0
    atkSpeed = 4000
    coins = 0
    existingCoins = 0
    totalPoints = 0
    basePoints = 0
    $('.timer-points').html('Time: ' + t + '(s)' + ' Points: ' + Math.round(t * 3.45) + ' Coins: ' + coins + '<br> Laser interval: ' + atkSpeed + ' Laser amount: ' + laserAmount);
    fillGrid2();
}

function fillGrid2() {
    grid2 = ['V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V'];

    for (i = 0; i <= 62; i++) {
        grid2.push('O');
    }
    grid2[currentPosition] = '+'
    if (existingCoins <= 1) {

        //Should replace with random.js plugin
        min = Math.ceil(9);
        max = Math.floor(grid2.length - 1);
        dotPos = Math.floor(Math.random() * (max - min + 1)) + min;
        if (dotPos != currentPosition) {
            grid2[dotPos] = '*'
        }
        else {
            dotpos += 2
            grid2[dotPos] = '*'
        }
    }
    $('.container2').html(grid2);
    console.log(grid2.length - 1)
}


$(document).ready(function () {
    totalPoints = 0

    $('input').on('mousedown', function (event) {
        event.stopPropagation();

    })
    $(document).on('keydown', function (k) {
        k.stopPropagation();

if( $('.container2').css('visibility') == 'visible') {
        if (k.key == 'ArrowLeft' && currentPosition != 9) {
            newPos = currentPosition - 1
            move2(newPos)
        }
        if (k.key == 'ArrowRight' && currentPosition != 71) {
            newPos = currentPosition + 1
            move2(newPos)
        }
        if (k.key == 'ArrowUp' && !(currentPosition <= 17)) {
            newPos = currentPosition - 9
            move2(newPos)
        }
        if (k.key == 'ArrowDown' && !(currentPosition >= 63)) {
            newPos = currentPosition + 9
            move2(newPos)
        }
    }
    })
});

function points() {
    t += 1
    basePoints = Math.round(t * 3.45)
    $('.timer-points').html('Time: ' + t + '(s)' + ' Points: ' + basePoints + ' Coins: ' + coins + '<br> Laser interval: ' + atkSpeed + ' Max. Laser amount: ' + laserAmount);
}

function lasers() {
    if(atkSpeed >= 2100) {
    atkSpeed = Math.round(atkSpeed / 1.09)
    }
    if (laserAmount <= 6) {
        laserAmount += 1
    }

}
function attackWarning() {
    attackPositions.forEach(pos => {
        if (grid2[pos] == 'V') {
            grid2[pos] = 'U'
            $('.container2').html(grid2);
            return
        }
        else if (grid2[pos] == 'U') {
            grid2[pos] = 'V'
            $('.container2').html(grid2);
        }
    });

}
function setAttackPositions() {
    console.log("warning")

    laserPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    attackPositions = []
    for (i = 0; i <= laserAmount; i++) {
        laserPos = laserPositions.splice(Math.floor(Math.random() * (i + 1)), 1)[0]
        attackPositions.push(laserPos)
        console.log(laserPos)
    }
    atkWarningInterval = setInterval(attackWarning, atkSpeed / 6.4)
    setTimeout(shootLaser, ((atkSpeed / 10) * 5) + 80)
}

function shootLaser() {
    attackPositions.forEach(pos => {
        laserPos = pos;
        for (i = 0; i < 7; i++) {
            laserPos += 9
            grid2[laserPos] = 'V';
            if (laserPos == currentPosition) {
                hit = true;
                endRound();
            }
        }
    });
    if (hit == false) {
       testTimeout =  setTimeout(test, 1000)
       fillGrid2Timeout = setTimeout(fillGrid2, 1000)
    }
}

function test() {
    clearInterval(atkWarningInterval)
    shootLaserInterval = setTimeout(setAttackPositions, atkSpeed)
}

function move2(newPos) {

    if (grid2[newPos] == '*') {
        grid2[newPos] = 'O';
        coins += 1
    }
    if (grid2[newPos] == 'V') {
        hit = true;
        endRound();
    } else {
            element = grid2[currentPosition];
            grid2.splice(currentPosition, 1);
            grid2.splice(newPos, 0, element);
            $('.container2').html(grid2);
            currentPosition = newPos;
    }
}

function endRound() {
    clearInterval(atkWarningInterval)
    clearTimeout(shootLaserInterval)
    clearTimeout(fillGrid2Timeout)
    clearTimeout(testTimeout)
    clearInterval(pointsInterval)
    clearInterval(updateLasers)
    grid2.length = 0;
    grid2.push('Youve been hit by a laser. You lost.')
    $('.container2').html(grid2)
    totalPoints = basePoints + (coins * 10)
    $('.timer-points').html('Total points: ' + totalPoints + ' (' + basePoints + ' + ' + coins + ' * 10) Time survived: ' + t + ' seconds')
    sendDatabaseUpdate(totalPoints, coins, "newMaxScore2", "")
}

