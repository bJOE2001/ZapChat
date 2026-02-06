<template>
  <q-page class="snake-game-page">
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/games')" />
      <q-toolbar-title class="text-weight-bold">Snake Game</q-toolbar-title>
    </q-toolbar>

    <div class="q-pa-md">
      <div class="row justify-center q-mb-md">
        <div class="text-h6">Score: {{ score }}</div>
        <q-space />
        <div class="text-h6">High Score: {{ highScore }}</div>
      </div>

      <div class="row justify-center">
        <div class="game-container">
          <canvas ref="canvasRef" class="game-canvas" />
          <div v-if="gameOver" class="game-overlay">
            <div class="text-h4 q-mb-md">Game Over!</div>
            <div class="text-h6 q-mb-md">Final Score: {{ score }}</div>
            <q-btn
              unelevated
              color="primary"
              label="Play Again"
              size="lg"
              @click="restart"
            />
          </div>
          <div v-if="!started && !gameOver" class="game-overlay">
            <div class="text-h5 q-mb-md">Press Space to Start</div>
            <div class="text-body2">Use Arrow Keys or Swipe to Control</div>
          </div>
        </div>
      </div>

      <div class="row justify-center q-mt-md">
        <div class="controls-hint">
          <q-icon name="keyboard_arrow_up" size="md" />
          <div class="row q-gutter-xs">
            <q-icon name="keyboard_arrow_left" size="md" />
            <q-icon name="keyboard_arrow_down" size="md" />
            <q-icon name="keyboard_arrow_right" size="md" />
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
const highScore = ref(parseInt(localStorage.getItem('snakeHighScore') || '0'))
const gameOver = ref(false)
const started = ref(false)

let canvas = null
let ctx = null
const gridSize = 20
const tileCount = 20
let snake = [{ x: 10, y: 10 }]
let food = { x: 15, y: 15 }
let dx = 0
let dy = 0
let gameLoop = null

function initCanvas () {
  canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  canvas.width = tileCount * gridSize
  canvas.height = tileCount * gridSize
}

function drawGame () {
  if (!ctx) return
  
  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = '#4caf50'
  snake.forEach((segment, index) => {
    if (index === 0) {
      ctx.fillStyle = '#66bb6a'
    } else {
      ctx.fillStyle = '#4caf50'
    }
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2)
  })

  ctx.fillStyle = '#f44336'
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2)
}

function moveSnake () {
  if (!started.value || gameOver.value) return

  const head = { x: snake[0].x + dx, y: snake[0].y + dy }

  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    endGame()
    return
  }

  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    endGame()
    return
  }

  snake.unshift(head)

  if (head.x === food.x && head.y === food.y) {
    score.value += 10
    generateFood()
  } else {
    snake.pop()
  }

  drawGame()
}

function generateFood () {
  do {
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    }
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y))
}

function handleKeyPress (e) {
  if (e.code === 'Space' && !started.value) {
    started.value = true
    dx = 1
    dy = 0
    return
  }

  if (gameOver.value) return

  const key = e.key
  if (key === 'ArrowUp' && dy !== 1) {
    dx = 0
    dy = -1
    started.value = true
  } else if (key === 'ArrowDown' && dy !== -1) {
    dx = 0
    dy = 1
    started.value = true
  } else if (key === 'ArrowLeft' && dx !== 1) {
    dx = -1
    dy = 0
    started.value = true
  } else if (key === 'ArrowRight' && dx !== -1) {
    dx = 1
    dy = 0
    started.value = true
  }
}

function endGame () {
  gameOver.value = true
  if (score.value > highScore.value) {
    highScore.value = score.value
    localStorage.setItem('snakeHighScore', score.value.toString())
  }
}

function restart () {
  snake = [{ x: 10, y: 10 }]
  food = { x: 15, y: 15 }
  dx = 0
  dy = 0
  score.value = 0
  gameOver.value = false
  started.value = false
  drawGame()
}

onMounted(() => {
  initCanvas()
  drawGame()
  window.addEventListener('keydown', handleKeyPress)
  gameLoop = setInterval(moveSnake, 150)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyPress)
  if (gameLoop) clearInterval(gameLoop)
})
</script>

<style scoped>
.snake-game-page {
  background: #f5f5f5;
}

.game-container {
  position: relative;
  display: inline-block;
}

.game-canvas {
  border: 3px solid #333;
  border-radius: 8px;
  background: #1a1a1a;
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

.controls-hint {
  text-align: center;
  color: #666;
}
</style>
