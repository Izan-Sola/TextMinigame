
function fillGrid3() {
    // posible rank names: {Short Legged}, {Average}, {Sprinter}, {Speed Runner}
    container = $( '#container3' )
    container.html( '' )
    grid3 = container.text().split( '' )
    start = Random.integer( 0, 8 )
    playerStart = start
    playerEnd = 0
    currentPosition = playerStart
    coinPosition = null

    for ( j = 0; j < 6; j++ ) {

        end = Random.integer( 0, 8 )

        for ( y = 0; y < 9; y++ ) {
            if ( y != start ) {
                if ( coinPosition != null && coinPosition == y ) {
                    grid3.push( 'Φ' )
                    coinPosition = null
                }
                else grid3.push( 'X' )

            } else if ( Random.integer( barrierChance, 8 ) == barrierChance ) grid3.push( '═' )
              else grid3.push( 'O' )

        }

        for ( i = 0; i < 9; i++ ) {
            // draws path between the points
            if ( ( i >= start && i <= end ) || ( i <= start && i >= end ) ) {
                grid3.push( 'O' )
                // removes coin if it is between 2 paths to avoid making a bridge
                l = grid3.length
                if ( grid3[ l - 10 ] == 'Φ' && grid3[ l - 19 ] == 'O' ) grid3[ l - 10 ] = 'X'

                if ( j == 5 ) playerEnd = grid3.length - 1
        
            } else grid3.push( 'X' )
            

            // determines the position of the coin
            if ( i > start && i < end ) {
                if ( Random.integer( coinChance, 4 ) == coinChance ) coinPosition = i
                else coinPosition == null    
            }
        }

        start = end
    }

    grid3[ playerStart ] = '+'
    container.html( grid3 )
    console.log( playerEnd, grid3[ playerEnd ] )
}

function start () {
    fillgrid3()
    timerInterval = setInterval( timer, 1000 )
    incomingDeathInterval = setInterval( incomingDeath, incomingDeathDelay )
}

function end() {
    clearInterval( timerInterval )
    clearInterval( incomingDeathInterval )
    alert("Time 0")

    //sendDatabaseUpdate(totalPoints, coins, "newMaxScore3", "")
}

function incomingDeath() {
    
    for( i = 9 * row; i < 9 * row + 9; i++ ) grid3[ i ] = 'V'
    console.log(incomingDeathDelay)
    container.html( grid3 )
    row += 1
}

function timer () {
    currentTime -= 1

    if ( currentTime % 8 == 0 ) barrierChance += 1
    else if ( currentTime % 16 == 0 ) coinChance += 1
    else if ( currentTime % 4 == 0  && incomingDeathDelay > 1250 ) incomingDeathDelay -= 50
   
   
    $( '.timer-points' ).html(
        'Time left: ' + currentTime + ' (s)' +
        ' Points: ' + points +
        ' Coins: ' + coins +
        '<br> Barrier frequency: ' + barrierChance +
        ' Paths completed: ' + 0 +
        ' Incoming Death Delay: ' + incomingDeathDelay
    )

    if ( currentTime == 0 ) end()
}

$( document ).on( 'keydown', function ( k ) {

    position = currentPosition
    pastPosition = position

    if ( coinPos != null ) {
        grid3[ coinPos ] = 'O'
    }

    switch ( k.key ) {
        case 'ArrowUp':
            position -= 9
            break
        case 'ArrowLeft':
            position -= 1
            break
        case 'ArrowDown':
            position += 9
            break
        case 'ArrowRight':
            position += 1
            break
        case ' ':
            if ( grid3[ position + 9 ] == '═' ) {
                position += 18
            }
            break
    }

    if ( k.key != ' ' && grid3[ position ] == '═' ) {
        position = pastPosition
        console.log( 'hey' )
    }

    if ( position == playerEnd ) {
        fillgrid3()
        points += t + currentTime
        clearInterval(incomingDeathInterval)

        setTimeout( () => {
            setInterval( incomingDeath, incomingDeathDelay )
        }, 2000 )

        row = 0
    } else if ( !( position > grid3.length ) && !( position < grid3.length - grid3.length - 1 ) ) {

        switch ( grid3[ position ] ) {

            case 'X':
                container.html( 'You stepped out of the path!' )
                end();
                break

            case 'O':
                grid3[ currentPosition ] = 'O'
                grid3[ position ] = '+'
                container.html( grid3 )
                break

            case 'Φ':
                coinPos = grid3.indexOf( 'Φ' )
                grid3[ currentPosition ] = 'O'
                grid3[ position ] = '+'
                container.html( grid3 )
                points += 20 + ( 20 * ( currentTime / 100 ) )
                break
        }

        currentPosition = position
    }
} )

$( document ).ready( function () {
    Random = new Random.Random()
    currentTime = 60
    t = currentTime
    coins = 0
    points = 0
    barrierChance = 1
    coinChance = 1
    coinPos = null
    incomingDeathDelay = 1500
    row = 0

    $( '.timer-points' ).html(
        'Time left: ' + currentTime + ' (s)' +
        ' Points: ' + points +
        ' Coins: ' + coins +
        '<br> Barrier frequency: ' + barrierChance +
        ' Paths completed: ' + 0
    )
    // fillGrid3()
} )
