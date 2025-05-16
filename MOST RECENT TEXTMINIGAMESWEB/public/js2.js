import { Random } from 'https://cdn.skypack.dev/random-js';
const random = new Random();
import { sendDatabaseUpdate } from './main.js';
 

export { start }

let hit;
let newPos;
let timertest;
let currentPosition;
let laserAmount;
let t;
let atkSpeed;
let coins;
let existingCoins;
let totalPoints;
let basePoints;
let grid = [];
let dotPos;
let attackPositions;
let shootLaserInterval;
let pointsInterval;
let updateLasers;
let atkWarningInterval;
let testTimeout;
let fillGridTimeout;

function start() {
    const shootLaserInterval = setTimeout(setAttackPositions, atkSpeed)
    const pointsInterval = setInterval(points, 1000)
    const updateLasers = setInterval(lasers, 6500)
    hit = false;
    newPos = 0;
    timertest = 0;
    currentPosition = 71;
    laserAmount = 1;
    t = 0;
    atkSpeed = 4000;
    coins = 0;
    existingCoins = 0;
    totalPoints = 0;
    basePoints = 0;
    $('.timer-points').html('Time: ' + t + '(s)' + ' Points: ' + Math.round(t * 3.45) + ' Coins: ' + coins + '<br> Laser interval: ' + atkSpeed + ' Laser amount: ' + laserAmount);
    fillGrid2();
}

function fillGrid2() {
    grid = ['V', 'V', 'V', 'V', 'V', 'V', 'V', 'V', 'V'];

    for (let i = 0; i <= 62; i++) {
        grid.push('O');
    }
    grid[currentPosition] = '+'

    if (existingCoins <= 1) {

        dotPos = random.integer(10, 60);

        if (dotPos !== currentPosition) grid[dotPos] = '*'
        else {
            dotPos += 2
            grid[dotPos] = '*'
        }
    }
    $('.container2').html(grid);
    console.log(grid.length - 1);
}

function points() {
    t += 1;
    basePoints = Math.round(t * 3.45);
    $('.timer-points').html('Time: ' + t + '(s)' + ' Points: ' + basePoints + ' Coins: ' + coins + '<br> Laser interval: ' + atkSpeed + ' Max. Laser amount: ' + laserAmount);
}

function lasers() {
    if (laserAmount <= 6) laserAmount += 1;
    if (atkSpeed >= 2100) atkSpeed = Math.round(atkSpeed / 1.08);
}

function attackWarning() {
    attackPositions.forEach(pos => {
        if (grid[pos] === 'V') {
            grid[pos] = 'U';
        } else if (grid[pos] === 'U') {
            grid[pos] = 'V';
        }
    });
    $('.container2').html(grid);
}

function setAttackPositions() {
    console.log("warning");
    const laserPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    attackPositions = [];
    for (let i = 0; i < laserAmount; i++) {
        const index = random.integer(0, laserPositions.length - 1);
        const laserPos = laserPositions.splice(index, 1)[0];
        attackPositions.push(laserPos);
        console.log(laserPos);
    }
    console.log(attackPositions, "laseramount", laserAmount);
    atkWarningInterval = setInterval(attackWarning, atkSpeed / 6.4);
    setTimeout(shootLaser, ((atkSpeed / 10) * 5) + 80);
}

function shootLaser() {
    attackPositions.forEach(pos => {
        let laserPos = pos;
        for (let i = 0; i < 7; i++) {
            laserPos += 9;
            grid[laserPos] = 'V';
            if (laserPos === currentPosition) {
                hit = true;
                endRound();
            }
        }
    });

    if (!hit) {
        testTimeout = setTimeout(test, 1000);
        fillGridTimeout = setTimeout(fillGrid2, 1000);
    }
}

function test() {
    clearInterval(atkWarningInterval);
    shootLaserInterval = setTimeout(setAttackPositions, atkSpeed);
}

function move(newPos) {
    if (grid[newPos] == '*') {
        grid[newPos] = 'O';
        coins += 1;
    }
    if (grid[newPos] == 'V') {
        hit = true;
        endRound();
    } else {
        const element = grid[currentPosition];
        grid.splice(currentPosition, 1);
        grid.splice(newPos, 0, element);
        $('.container2').html(grid);
        currentPosition = newPos;
    }
}

function endRound() {
    clearInterval(atkWarningInterval);
    clearTimeout(shootLaserInterval);
    clearTimeout(fillGridTimeout);
    clearTimeout(testTimeout);
    clearInterval(pointsInterval);
    clearInterval(updateLasers);
    grid.length = 0;
    grid.push('Youve been hit by a laser. You lost.');
    $('.container2').html(grid);
    totalPoints = basePoints + (coins * 10);
    $('.timer-points').html('Total points: ' + totalPoints + ' (' + basePoints + ' + ' + coins + ' * 10) Time survived: ' + t + ' seconds');
    sendDatabaseUpdate(totalPoints, coins, "newMaxScore2", "");
}

$(document).ready(function () {

    $(document).on('keydown', function (k) {

        k.stopPropagation();
        if( $('.container2').css('visibility') == 'visible' ) {
            

            if (k.key == 'ArrowLeft' && currentPosition !== 9) move(currentPosition - 1);
            else if (k.key == 'ArrowRight' && currentPosition !== 71) move(currentPosition + 1);
            else if (k.key == 'ArrowUp' && currentPosition > 17) move(currentPosition - 9);
            else if (k.key == 'ArrowDown' && currentPosition < 63) move(currentPosition + 9);
        }
    });
});
