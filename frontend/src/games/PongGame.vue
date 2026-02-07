<template>
  <q-page class="pong-page">
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/games')" />
      <q-toolbar-title class="text-weight-bold">Pong</q-toolbar-title>
    </q-toolbar>

    <div class="q-pa-md">
      <div class="row justify-center q-mb-md">
        <div class="text-h6">Your Score: {{ playerScore }}</div>
        <q-space />
        <div class="text-h6">AI Score: {{ aiScore }}</div>
      </div>

      <div class="row justify-center">
        <canvas ref="canvasRef" class="game-canvas" />
      </div>

      <div class="row justify-center q-mt-md">
        <div class="text-body2 text-grey-7">Move mouse or use arrow keys</div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasRef = ref(null)
const playerScore = ref(0)
const aiScore = ref(0)

let canvas = null
let ctx = null
let paddleY = 250
let aiPaddleY = 250
let ballX = 400
let ballY = 300
let ballSpeedX = 5
let ballSpeedY = 3
let gameLoop = null

function initCanvas () {
  canvas = canvasRef.value
  ctx = canvas.getContext('2d')
  canvas.width = 800
  canvas.height = 600
}

function draw () {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  ctx.fillStyle = '#fff'
  ctx.fillRect(20, paddleY, 10, 100)
  ctx.fillRect(canvas.width - 30, aiPaddleY, 10, 100)
  
  ctx.beginPath()
  ctx.arc(ballX, ballY, 10, 0, Math.PI * 2)
  ctx.fill()
  
  ctx.setLineDash([5, 5])
  ctx.beginPath()
  ctx.moveTo(canvas.width / 2, 0)
  ctx.lineTo(canvas.width / 2, canvas.height)
  ctx.strokeStyle = '#fff'
  ctx.stroke()
  ctx.setLineDash([])
}

function update () {
  ballX += ballSpeedX
  ballY += ballSpeedY
  
  if (aiPaddleY + 50 < ballY) aiPaddleY += 4
  if (aiPaddleY + 50 > ballY) aiPaddleY -= 4
  
  if (ballY <= 10 || ballY >= canvas.height - 10) ballSpeedY = -ballSpeedY
  
  if (ballX <= 30 && ballY >= paddleY && ballY <= paddleY + 100) {
    ballSpeedX = -ballSpeedX
    ballX = 30
  }
  if (ballX >= canvas.width - 30 && ballY >= aiPaddleY && ballY <= aiPaddleY + 100) {
    ballSpeedX = -ballSpeedX
    ballX = canvas.width - 30
  }
  
  if (ballX < 0) {
    aiScore.value++
    resetBall()
  }
  if (ballX > canvas.width) {
    playerScore.value++
    resetBall()
  }
  
  draw()
}

function resetBall () {
  ballX = canvas.width / 2
  ballY = canvas.height / 2
  ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 5
  ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 3
}

function handleMouseMove (e) {
  const rect = canvas.getBoundingClientRect()
  paddleY = e.clientY - rect.top - 50
  if (paddleY < 0) paddleY = 0
  if (paddleY > canvas.height - 100) paddleY = canvas.height - 100
}

function handleKeyPress (e) {
  if (e.key === 'ArrowUp' && paddleY > 0) paddleY -= 10
  if (e.key === 'ArrowDown' && paddleY < canvas.height - 100) paddleY += 10
}

onMounted(() => {
  initCanvas()
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
.pong-page {
  background: #f5f5f5;
}

.game-canvas {
  border: 3px solid #333;
  border-radius: 8px;
  background: #000;
}
</style>
