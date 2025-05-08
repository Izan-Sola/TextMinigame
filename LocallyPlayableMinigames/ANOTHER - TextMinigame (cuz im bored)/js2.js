

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
    fillGrid();
}

function fillGrid() {
    grid = ['V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V'];

    for (i = 0; i <= 62; i++) {
        grid.push('O');
    }
    grid[currentPosition] = '+'
    if (existingCoins <= 1) {

        min = Math.ceil(9);
        max = Math.floor(grid.length - 1);
        dotPos = Math.floor(Math.random() * (max - min + 1)) + min;
        if (dotPos != currentPosition) {
            grid[dotPos] = '*'
        }
        else {
            dotpos += 2
            grid[dotPos] = '*'
        }
    }
    $('.container2').html(grid);
    console.log(grid.length - 1)
}

//TODO: Also display coins on the scoreboard alongside the points. (and the rank too ofc)
//TODO: Add another score column to the database and add the required querys
//TODO: Should probably move the fetch function into a separate script.

$(document).ready(function () {
    start();

    $('input').on('mousedown', function (event) {
        event.stopPropagation();

        if (this.id == 'start') {
            start();
            shootLaserInterval = setTimeout(setAttackPositions, atkSpeed)
            pointsInterval = setInterval(points, 1000)
            updateLasers = setInterval(lasers, 6500)
        }
    })
    $(document).on('keydown', function (k) {
        k.stopPropagation();

        if (k.key == 'ArrowLeft' && currentPosition != 9) {
            newPos = currentPosition - 1
            move(newPos)
        }
        if (k.key == 'ArrowRight' && currentPosition != 71) {
            newPos = currentPosition + 1
            move(newPos)
        }
        if (k.key == 'ArrowUp' && !(currentPosition <= 17)) {
            newPos = currentPosition - 9
            move(newPos)
        }
        if (k.key == 'ArrowDown' && !(currentPosition >= 63)) {
            newPos = currentPosition + 9
            move(newPos)
        }
    })
});

function points() {
    t += 1
    basePoints = Math.round(t * 3.45)
    $('.timer-points').html('Time: ' + t + '(s)' + ' Points: ' + basePoints + ' Coins: ' + coins + '<br> Laser interval: ' + atkSpeed + ' Max. Laser amount: ' + laserAmount);
}

function lasers() {
    atkSpeed = Math.round(atkSpeed / 1.08)
    if (laserAmount <= 6) {
        laserAmount += 1
    }

}
function attackWarning() {
    attackPositions.forEach(pos => {
        if (grid[pos] == 'V') {
            grid[pos] = 'U'
            $('.container2').html(grid);
            return
        }
        else if (grid[pos] == 'U') {
            grid[pos] = 'V'
            $('.container2').html(grid);
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
            grid[laserPos] = 'V';
            if (laserPos == currentPosition) {
                hit = true;
                endRound();
            }
        }
    });
    if (hit == false) {
       testTimeout =  setTimeout(test, 1000)
       fillGridTimeout = setTimeout(fillGrid, 1000)
    }
}

function test() {
    clearInterval(atkWarningInterval)
    shootLaserInterval = setTimeout(setAttackPositions, atkSpeed)
}

function move(newPos) {

    if (grid[newPos] == '*') {
        grid[newPos] = 'O';
        coins += 1
    }
    if (grid[newPos] == 'V') {
        hit = true;
        endRound();
    } else {
            element = grid[currentPosition];
            grid.splice(currentPosition, 1);
            grid.splice(newPos, 0, element);
            $('.container2').html(grid);
            currentPosition = newPos;
    }
}

function endRound() {
    clearInterval(atkWarningInterval)
    clearTimeout(shootLaserInterval)
    clearTimeout(fillGridTimeout)
    clearTimeout(testTimeout)
    clearInterval(pointsInterval)
    clearInterval(updateLasers)
    grid.length = 0;
    grid.push('Youve been hit by a laser. You lost.')
    $('.container2').html(grid)
    totalPoints = basePoints + (coins * 10)
    $('.timer-points').html('Total points: ' + totalPoints + ' (' + basePoints + ' + ' + coins + ' * 10) Time survived: ' + t + ' seconds')
}
