function fillGrid () {
    // posible rank names: {Short Legged}, {Average}, {Sprinter}, {Speed Runner}
    container = $( '#container3' )
    container.html( '' )
    grid = container.text().split( '' )
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
                    grid.push( 'Φ' )
                    coinPosition = null
                }
                else grid.push( 'X' )

            } else if ( Random.integer( barrierChance, 8 ) == barrierChance ) grid.push( '═' )
              else grid.push( 'O' )

        }

        for ( i = 0; i < 9; i++ ) {
            // draws path between the points
            if ( ( i >= start && i <= end ) || ( i <= start && i >= end ) ) {
                grid.push( 'O' )
                // removes coin if it is between 2 paths to avoid making a bridge
                l = grid.length
                if ( grid[ l - 10 ] == 'Φ' && grid[ l - 19 ] == 'O' ) grid[ l - 10 ] = 'X'

                if ( j == 5 ) playerEnd = grid.length - 1
        
            } else grid.push( 'X' )
            

            // determines the position of the coin
            if ( i > start && i < end ) {
                if ( Random.integer( coinChance, 4 ) == coinChance ) coinPosition = i
                else coinPosition == null    
            }
        }

        start = end
    }

    grid[ playerStart ] = '+'
    container.html( grid )
    console.log( playerEnd, grid[ playerEnd ] )
}

function start () {
    fillGrid()
    timerInterval = setInterval( timer, 1000 )
    incomingDeathInterval = setInterval( incomingDeath, incomingDeathDelay )
}

function end() {
    clearInterval( timerInterval )
    clearInterval( incomingDeathInterval )
    alert("Time 0")
}

function incomingDeath() {
    
    for( i = 9 * row; i < 9 * row + 9; i++ ) grid[ i ] = 'V'
    console.log(incomingDeathDelay)
    container.html( grid )
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
        grid[ coinPos ] = 'O'
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
            if ( grid[ position + 9 ] == '═' ) {
                position += 18
            }
            break
    }

    if ( k.key != ' ' && grid[ position ] == '═' ) {
        position = pastPosition
        console.log( 'hey' )
    }

    if ( position == playerEnd ) {
        fillGrid()
        points += t + currentTime
        clearInterval(incomingDeathInterval)

        setTimeout( () => {
            setInterval( incomingDeath, incomingDeathDelay )
        }, 2000 )

        row = 0
    } else if ( !( position > grid.length ) && !( position < grid.length - grid.length - 1 ) ) {

        switch ( grid[ position ] ) {

            case 'X':
                container.html( 'You stepped out of the path!' )
                end();
                break

            case 'O':
                grid[ currentPosition ] = 'O'
                grid[ position ] = '+'
                container.html( grid )
                break

            case 'Φ':
                coinPos = grid.indexOf( 'Φ' )
                grid[ currentPosition ] = 'O'
                grid[ position ] = '+'
                container.html( grid )
                points += 20 + ( 20 * ( currentTime / 100 ) )
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
    // fillGrid()
} )
