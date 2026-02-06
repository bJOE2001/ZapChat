<template>
  <q-page class="breakout-page">
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/games')" />
      <q-toolbar-title class="text-weight-bold">Breakout</q-toolbar-title>
      <q-btn flat round dense icon="refresh" @click="restart" />
    </q-toolbar>

    <div class="q-pa-md">
      <div class="row justify-center q-mb-md">
        <div class="text-h6">Score: {{ score }}</div>
        <q-space />
        <div class="text-h6">Lives: {{ lives }}</div>
      </div>

      <div class="row justify-center">
        <canvas ref="canvasRef" class="game-canvas" />
      </div>

      <div class="row justify-center q-mt-md">
        <div class="mobile-controls-breakout">
          <q-btn
            unelevated
            round
            color="primary"
            icon="arrow_back"
            size="lg"
            class="control-btn"
            @mousedown="movePaddleLeft"
            @touchstart.prevent="movePaddleLeft"
            @mouseup="stopMove"
            @touchend="stopMove"
          />
          <q-btn
            unelevated
            round
            color="primary"
            icon="arrow_forward"
            size="lg"
            class="control-btn"
            @mousedown="movePaddleRight"
            @touchstart.prevent="movePaddleRight"
            @mouseup="stopMove"
            @touchend="stopMove"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasRef = ref(null)
const score = ref(0)
const lives = ref(3)

let canvas = null
let ctx = null
let paddleX = 300
let ballX = 400
let ballY = 500
let ballSpeedX = 4
let ballSpeedY = -4
let bricks = []
let gameLoop = null
let paddleMoveDir = 0

function initBricks () {
  bricks = []
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 10; col++) {
      bricks.push({ x: col * 80 + 10, y: row * 30 + 50, alive: true })
    }
  }
}

function draw () {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  ctx.fillStyle = '#0f0'
  ctx.fillRect(paddleX, canvas.height - 30, 100, 10)
  
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(ballX, ballY, 8, 0, Math.PI * 2)
  ctx.fill()
  
  bricks.forEach(brick => {
    if (brick.alive) {
      ctx.fillStyle = '#f00'
      ctx.fillRect(brick.x, brick.y, 70, 20)
    }
  })
}

function update () {
  if (paddleMoveDir !== 0) {
    paddleX += paddleMoveDir * 10
    if (paddleX < 0) paddleX = 0
    if (paddleX > canvas.width - 100) paddleX = canvas.width - 100
  }
  
  ballX += ballSpeedX
  ballY += ballSpeedY
  
  if (ballX <= 8 || ballX >= canvas.width - 8) ballSpeedX = -ballSpeedX
  if (ballY <= 8) ballSpeedY = -ballSpeedY
  
  if (ballY >= canvas.height - 38 && ballX >= paddleX && ballX <= paddleX + 100) {
    ballSpeedY = -Math.abs(ballSpeedY)
  }
  
  bricks.forEach(brick => {
    if (brick.alive && ballX >= brick.x && ballX <= brick.x + 70 &&
        ballY >= brick.y && ballY <= brick.y + 20) {
      brick.alive = false
      ballSpeedY = -ballSpeedY
      score.value += 10
    }
  })
  
  if (ballY > canvas.height) {
    lives.value--
    if (lives.value <= 0) {
      alert('Game Over! Final Score: ' + score.value)
      restart()
    } else {
      ballX = 400
      ballY = 500
      ballSpeedX = 4
      ballSpeedY = -4
    }
  }
  
  if (bricks.every(b => !b.alive)) {
    alert('You Win! Score: ' + score.value)
    restart()
  }
  
  draw()
}

function handleMouseMove (e) {
  const rect = canvas.getBoundingClientRect()
  paddleX = e.clientX - rect.left - 50
  if (paddleX < 0) paddleX = 0
  if (paddleX > canvas.width - 100) paddleX = canvas.width - 100
}

function movePaddleLeft () {
  paddleMoveDir = -1
}

function movePaddleRight () {
  paddleMoveDir = 1
}

function stopMove () {
  paddleMoveDir = 0
}

function handleKeyPress (e) {
  if (e.key === 'ArrowLeft') movePaddleLeft()
  if (e.key === 'ArrowRight') movePaddleRight()
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    setTimeout(() => stopMove(), 100)
  }
}

function restart () {
  score.value = 0
  lives.value = 3
  paddleX = 300
  ballX = 400
  ballY = 500
  ballSpeedX = 4
  ballSpeedY = -4
  initBricks()
}

onMounted(() => {
  canvas = canvasRef.value
  ctx = canvas.getContext('2d')
  canvas.width = 800
  canvas.height = 600
  initBricks()
  draw()
  canvas.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('keydown', handleKeyPress)
  gameLoop = setInterval(update, 16)
})

onBeforeUnmount(() => {
  canvas.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('keydown', handleKeyPress)
  if (gameLoop) clearInterval(gameLoop)
})
</script>

<style scoped>
.breakout-page {
  background: #f5f5f5;
}

.game-canvas {
  border: 3px solid #333;
  border-radius: 8px;
  background: #000;
  touch-action: none;
}

.mobile-controls-breakout {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.control-btn {
  min-width: 60px;
  min-height: 60px;
  touch-action: manipulation;
}
</style>
