<template>
  <q-page class="tetris-page">
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/games')" />
      <q-toolbar-title class="text-weight-bold">Tetris</q-toolbar-title>
      <q-btn flat round dense :icon="paused ? 'play_arrow' : 'pause'" @click="togglePause" />
    </q-toolbar>

    <div class="q-pa-md">
      <div class="row justify-center q-mb-md">
        <div class="text-h6">Score: {{ score }}</div>
        <q-space />
        <div class="text-h6">Lines: {{ lines }}</div>
        <q-space />
        <div class="text-h6">Level: {{ level }}</div>
      </div>

      <div class="row justify-center">
        <div class="game-container">
          <canvas ref="canvasRef" class="game-canvas" />
          <div v-if="gameOver" class="game-overlay">
            <div class="text-h4 q-mb-md">Game Over!</div>
            <div class="text-h6 q-mb-md">Final Score: {{ score }}</div>
            <q-btn unelevated color="primary" label="Play Again" size="lg" @click="restart" />
          </div>
          <div v-if="paused && !gameOver" class="game-overlay">
            <div class="text-h4">Paused</div>
          </div>
        </div>
      </div>

      <div class="row justify-center q-mt-md">
        <div class="mobile-controls-tetris">
          <div class="control-row">
            <q-btn
              unelevated
              round
              color="primary"
              icon="arrow_upward"
              size="lg"
              class="control-btn"
              @click="rotatePiece"
            />
          </div>
          <div class="control-row">
            <q-btn
              unelevated
              round
              color="primary"
              icon="arrow_back"
              size="lg"
              class="control-btn"
              @click="moveLeft"
            />
            <q-btn
              unelevated
              round
              color="secondary"
              icon="arrow_downward"
              size="lg"
              class="control-btn"
              @click="dropPiece"
            />
            <q-btn
              unelevated
              round
              color="primary"
              icon="arrow_forward"
              size="lg"
              class="control-btn"
              @click="moveRight"
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasRef = ref(null)
const score = ref(0)
const lines = ref(0)
const level = ref(1)
const paused = ref(false)
const gameOver = ref(false)

let canvas = null
let ctx = null
const COLS = 10
const ROWS = 20
const BLOCK_SIZE = 30
let board = []
let currentPiece = null
let dropTime = 0
let lastTime = 0
let gameLoop = null

const pieces = [
  [[1,1,1,1]], // I
  [[1,1],[1,1]], // O
  [[0,1,0],[1,1,1]], // T
  [[0,1,1],[1,1,0]], // S
  [[1,1,0],[0,1,1]], // Z
  [[1,0,0],[1,1,1]], // J
  [[0,0,1],[1,1,1]]  // L
]

function initBoard () {
  board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0))
}

function createPiece () {
  const type = pieces[Math.floor(Math.random() * pieces.length)]
  return {
    matrix: type,
    x: Math.floor(COLS / 2) - 1,
    y: 0
  }
}

function drawBoard () {
  if (!ctx) return
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (board[y][x]) {
        ctx.fillStyle = '#0f0'
        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1)
      }
    }
  }
  
  if (currentPiece) {
    ctx.fillStyle = '#f00'
    for (let y = 0; y < currentPiece.matrix.length; y++) {
      for (let x = 0; x < currentPiece.matrix[y].length; x++) {
        if (currentPiece.matrix[y][x]) {
          ctx.fillRect(
            (currentPiece.x + x) * BLOCK_SIZE,
            (currentPiece.y + y) * BLOCK_SIZE,
            BLOCK_SIZE - 1,
            BLOCK_SIZE - 1
          )
        }
      }
    }
  }
}

function collide (piece, dx, dy) {
  for (let y = 0; y < piece.matrix.length; y++) {
    for (let x = 0; x < piece.matrix[y].length; x++) {
      if (piece.matrix[y][x]) {
        const newX = piece.x + x + dx
        const newY = piece.y + y + dy
        if (newX < 0 || newX >= COLS || newY >= ROWS) return true
        if (newY >= 0 && board[newY][newX]) return true
      }
    }
  }
  return false
}

function mergePiece () {
  for (let y = 0; y < currentPiece.matrix.length; y++) {
    for (let x = 0; x < currentPiece.matrix[y].length; x++) {
      if (currentPiece.matrix[y][x]) {
        board[currentPiece.y + y][currentPiece.x + x] = 1
      }
    }
  }
}

function clearLines () {
  let cleared = 0
  for (let y = ROWS - 1; y >= 0; y--) {
    if (board[y].every(cell => cell === 1)) {
      board.splice(y, 1)
      board.unshift(Array(COLS).fill(0))
      cleared++
      y++
    }
  }
  if (cleared > 0) {
    lines.value += cleared
    score.value += cleared * 100 * level.value
    level.value = Math.floor(lines.value / 10) + 1
  }
}

function dropPiece () {
  if (collide(currentPiece, 0, 1)) {
    mergePiece()
    clearLines()
    currentPiece = createPiece()
    if (collide(currentPiece, 0, 0)) {
      gameOver.value = true
    }
  } else {
    currentPiece.y++
  }
}

function update (time = 0) {
  if (gameOver.value || paused.value) return
  
  const deltaTime = time - lastTime
  lastTime = time
  dropTime += deltaTime
  
  if (dropTime > 1000 - (level.value - 1) * 50) {
    dropPiece()
    dropTime = 0
  }
  
  drawBoard()
}

function moveLeft () {
  if (gameOver.value || paused.value) return
  if (!collide(currentPiece, -1, 0)) {
    currentPiece.x--
    drawBoard()
  }
}

function moveRight () {
  if (gameOver.value || paused.value) return
  if (!collide(currentPiece, 1, 0)) {
    currentPiece.x++
    drawBoard()
  }
}

function rotatePiece () {
  if (gameOver.value || paused.value) return
  const rotated = currentPiece.matrix[0].map((_, i) => 
    currentPiece.matrix.map(row => row[i]).reverse()
  )
  const original = currentPiece.matrix
  currentPiece.matrix = rotated
  if (collide(currentPiece, 0, 0)) {
    currentPiece.matrix = original
  }
  drawBoard()
}

function dropPiece () {
  if (gameOver.value || paused.value) return
  while (!collide(currentPiece, 0, 1)) {
    currentPiece.y++
    score.value += 2
  }
  drawBoard()
}

function handleKeyPress (e) {
  if (gameOver.value) return
  
  if (e.key === 'ArrowLeft') {
    moveLeft()
  } else if (e.key === 'ArrowRight') {
    moveRight()
  } else if (e.key === 'ArrowDown' && !collide(currentPiece, 0, 1)) {
    currentPiece.y++
    score.value++
    drawBoard()
  } else if (e.key === 'ArrowUp') {
    rotatePiece()
  } else if (e.key === ' ') {
    dropPiece()
  }
}

function togglePause () {
  paused.value = !paused.value
}

function restart () {
  score.value = 0
  lines.value = 0
  level.value = 1
  gameOver.value = false
  paused.value = false
  initBoard()
  currentPiece = createPiece()
  lastTime = 0
  dropTime = 0
  drawBoard()
}

onMounted(() => {
  canvas = canvasRef.value
  ctx = canvas.getContext('2d')
  canvas.width = COLS * BLOCK_SIZE
  canvas.height = ROWS * BLOCK_SIZE
  initBoard()
  currentPiece = createPiece()
  window.addEventListener('keydown', handleKeyPress)
  gameLoop = setInterval(() => update(Date.now()), 16)
  drawBoard()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyPress)
  if (gameLoop) clearInterval(gameLoop)
})
</script>

<style scoped>
.tetris-page {
  background: #f5f5f5;
}

.game-container {
  position: relative;
}

.game-canvas {
  border: 3px solid #333;
  border-radius: 8px;
  background: #000;
}

.game-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 8px;
}

.mobile-controls-tetris {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.control-row {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.control-btn {
  min-width: 60px;
  min-height: 60px;
  touch-action: manipulation;
}
</style>
