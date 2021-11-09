document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startButton = document.querySelector('#start')
  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0
  const colors = [
    'orange',
    'red',
    'white',
    'blue',
    'purple',
    'yellow'
  ]


  //  Tetris Pieces
  const L = [
    [0, 1, 2, width],
    [0, 1, width + 1, width * 2 + 1],
    [2, width, width + 1, width + 2],
    [1, width + 1, width * 2 + 1, width * 2 + 2]

  ]
  const J = [
    [0, 1, 2, width + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [0, width, width + 1, width + 2],
    [1, 2, width + 1, width * 2 + 1]
  ]
  const Z = [
    [0, 1, width + 1, width + 2],
    [2, width + 2, width + 1, width * 2 + 1],
    [0, 1, width + 1, width + 2],
    [2, width + 2, width + 1, width * 2 + 1]
  ]
  const S = [
    [2, 1, width + 1, width],
    [0, width, width + 1, width * 2 + 1],
    [2, 1, width + 1, width],
    [0, width, width + 1, width * 2 + 1]
  ]
  const O = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]
  const I = [
    [-1, 0, 1, 2],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [-1, 0, 1, 2],
    [1, width + 1, width * 2 + 1, width * 3 + 1]

  ]

  const pieces = [L, J, Z, S, O, I]

  let currentPosition = 4
  let currentRotation = 0

  // pick random piece
  let random = Math.floor(Math.random() * pieces.length)
  let current = pieces[random][currentRotation]

  // draw the piece
  function draw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroudColor = colors[random]
    })
  }
  // undraw the piece
  function undraw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroudColor = ''
    })
  }

  // timerId = setInterval(moveDown, 1000)

  function controls (event) {
    if (event.keyCode === 37) {
      // move piece left
      moveLeft()
    } else if (event.keyCode === 39) {
      // move piece right
      moveRight()
    } else if (event.keyCode === 40) {
      // move piece down
      moveDown()
    } else if (event.keyCode === 90) {
      // move piece clockwise (z)
      rotateClock()
    } else if (event.keyCode === 88) {
      // move piece anti-clockwise (x)
      rotateAntiClock()
    }
  }

  document.addEventListener('keyup', controls)

  // move down function
  function moveDown () {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  // stop the falling piece
  function freeze () {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      // start a new piece
      random = nextRandom
      nextRandom = Math.floor(Math.random() * pieces.length)
      current = pieces[random][currentRotation]
      currentPosition = 4
      draw()
      upNext()
      addScore()
      gameOver()
    }
  }

  function moveLeft () {
    undraw()
    const leftEdge = current.some(index => (currentPosition + index) % width === 0)

    if (!leftEdge) currentPosition -= 1

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }

    draw()
  }

  function moveRight () {
    undraw()
    const rightEdge = current.some(index => (currentPosition + index) % width === 9)

    if (!rightEdge) currentPosition += 1

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }

    draw()
  }

  function rotateClock () {
    undraw()
    currentRotation++
    if (currentRotation === current.length) {
      currentRotation = 0
    }
    current = pieces[random][currentRotation]
    draw()
  }

  function rotateAntiClock () {
    undraw()
    currentRotation -= 1
    if (currentRotation === -1) {
      currentRotation = 3
    }
    current = pieces[random][currentRotation]
    draw()
  }

  // show up next piece in miniGrid scoreDisplay
  const displaySquares = document.querySelectorAll('.miniGrid div')
  const displayWidth = 4
  const displayIndex = 0
  // was let

  // the pieces without rotations
  const upNextPieces = [
    [displayWidth, displayWidth + 1, displayWidth + 2, displayWidth * 2],
    [displayWidth, displayWidth + 1, displayWidth + 2, displayWidth * 2 + 2],
    [displayWidth, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 2 + 2],
    [displayWidth + 1, displayWidth + 2, displayWidth * 2, displayWidth * 2 + 1],
    [displayWidth + 1, displayWidth + 2, displayWidth * 2 + 1, displayWidth * 2 + 2],
    [displayWidth, displayWidth + 1, displayWidth + 2, displayWidth + 3]
  ]

  // display the up next piece
  function upNext () {
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroudColor = ''
    })
    upNextPieces[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroudColor = colors[nextRandom]
    })
  }

  // add functionality to the startButton
  startButton.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random() * pieces.length)
      upNext()
    }
  })

  function addScore () {
    for (let i = 0; i < 199; i += width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroudColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  function gameOver () {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
    }
  }
})
/*
document.addEventListener('DOMContentLoaded', () => {
  const ship = document.querySelector('div')
  ship.className = 'ship'

  function draw () {
    ship.classList.add('ship')
  }

  function undraw () {
    ship.classList.remove('ship')
  }

  function control (event) {
    if (event.keyCode === 38) {
      // up
      draw()
    } else if (event.keyCode === 40) {
      // down
      undraw()
    } else if (event.keyCode === 37) {

    } else if (event.keyCode === 39) {

    }
  }

  document.addEventListener('keyup', control)
})


document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startButton = document.querySelector('#start')
  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0


  //  Tetris Pieces
  const L = [
    [0, 1, 2, width],
    [0, 1, width + 1, width * 2 + 1],
    [2, width, width + 1, width + 2],
    [1, width + 1, width * 2 + 1, width * 2 + 2]

  ]
  const J = [
    [0, 1, 2, width + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [0, width, width + 1, width + 2],
    [1, 2, width + 1, width * 2 + 1]
  ]
  const Z = [
    [0, 1, width + 1, width + 2],
    [2, width + 2, width + 1, width * 2 + 1],
    [0, 1, width + 1, width + 2],
    [2, width + 2, width + 1, width * 2 + 1]
  ]
  const S = [
    [2, 1, width + 1, width],
    [0, width, width + 1, width * 2 + 1],
    [2, 1, width + 1, width],
    [0, width, width + 1, width * 2 + 1]
  ]
  const O = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]
  const I = [
    [-1, 0, 1, 2],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [-1, 0, 1, 2],
    [1, width + 1, width * 2 + 1, width * 3 + 1]

  ]

  const pieces = [L, J, Z, S, O, I]

  let currentPosition = 4
  let currentRotation = 0

  // pick random piece
  let random = Math.floor(Math.random() * pieces.length)
  let current = pieces[random][currentRotation]

  // draw the piece
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
    })
  }
  // undraw the piece
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
    })
  }

  // timerId = setInterval(moveDown, 1000)

  function controls(event) {
    if (event.keyCode === 37) {
      // move piece left
      moveLeft()
    } else if (event.keyCode === 39) {
      // move piece right
      moveRight()
    } else if (event.keyCode === 40) {
      // move piece down
      moveDown()
    } else if (event.keyCode === 90) {
      // move piece clockwise (z)
      rotateClock()
    } else if (event.keyCode === 88) {
      // move piece anti-clockwise (x)
      rotateAntiClock()
    }
  }

  document.addEventListener('keyup', controls)

  // move down function
  function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  // stop the falling piece
  function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      // start a new piece
      random = nextRandom
      nextRandom = Math.floor(Math.random() * pieces.length)
      current = pieces[random][currentRotation]
      currentPosition = 4
      draw()
      upNext()
      addScore()
      gameOver()
    }
  }

  function moveLeft() {
    undraw()
    const leftEdge = current.some(index => (currentPosition + index) % width === 0)

    if (!leftEdge) currentPosition -= 1

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }

    draw()
  }

  function moveRight() {
    undraw()
    const rightEdge = current.some(index => (currentPosition + index) % width === 9)

    if (!rightEdge) currentPosition += 1

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }

    draw()
  }

  function rotateClock() {
    undraw()
    currentRotation++
    if (currentRotation === current.length) {
      currentRotation = 0
    }
    current = pieces[random][currentRotation]
    draw()
  }

  function rotateAntiClock() {
    undraw()
    currentRotation -= 1
    if (currentRotation === -1) {
      currentRotation = 3
    }
    current = pieces[random][currentRotation]
    draw()
  }

  // show up next piece in miniGrid scoreDisplay
  const displaySquares = document.querySelectorAll('.miniGrid div')
  const displayWidth = 4
  let displayIndex = 0


  // the pieces without rotations
  const upNextPieces = [
    [displayWidth, displayWidth + 1, displayWidth + 2, displayWidth * 2],
    [displayWidth, displayWidth + 1, displayWidth + 2, displayWidth * 2 + 2],
    [displayWidth, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 2 + 2],
    [displayWidth + 1, displayWidth + 2, displayWidth * 2, displayWidth * 2 + 1],
    [displayWidth + 1, displayWidth + 2, displayWidth * 2 + 1, displayWidth * 2 + 2],
    [displayWidth, displayWidth + 1, displayWidth + 2, displayWidth + 3]
  ]


  // display the up next piece
  function upNext() {
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
    })
    upNextPieces[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
    })
  }

  // add functionality to the startButton
  startButton.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random() * pieces.length)
      upNext()
    }
  })

  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
    }
  }
})
/*
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <script src="script.js" type="text/javascript"></script>
  <link rel="stylesheet" href="style.css">
  <title>Tetris</title>
</head>

<body>
  <h1>Tetris</h1>
  <h3>Score:<span id="score"></span></h3>
  <button id="start">Start/Pause</button>

  <div class="container">
    <div class="grid">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>


      <div class='taken'></div>
      <div class='taken'></div>
      <div class='taken'></div>
      <div class='taken'></div>
      <div class='taken'></div>
      <div class='taken'></div>
      <div class='taken'></div>
      <div class='taken'></div>
      <div class='taken'></div>
      <div class='taken'></div>
    </div>

    <div class='miniGrid'>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>

</body>
</html>

.container {
  display: flex;
}

.grid {
  width: 200px;
  height: 400px;
  display: flex;
  flex-wrap: wrap;
  background-color: yellow;
}

.grid div {
  width: 20px;
  height: 20px;
}

.tetromino {
  background-color: blue;
}

.miniGrid {
  margin-left: 30px;
  width: 80px;
  height: 80px;
  display: flex;
  flex-wrap: wrap;
  background-color: yellow;
}

.miniGrid div {
  width: 20px;
  height: 20px;
}
*/
