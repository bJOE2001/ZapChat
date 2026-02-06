<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Brick Breaker</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>

      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Score: {{ score }}</div>
          <div class="text-caption text-grey-7">Touch or use buttons to move paddle</div>
        </div>

        <canvas
          ref="gameCanvas"
          width="400"
          height="500"
          class="brick-canvas"
          @mousemove="movePaddle"
          @touchmove.prevent="handleTouchMove"
        />
        <div class="row justify-center q-mt-md">
          <div class="mobile-controls-brick">
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
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const gameCanvas = ref(null)
const score = ref(0)
const paddleX = ref(150)
const ballX = ref(200)
const ballY = ref(250)
const ballDX = ref(3)
const ballDY = ref(-3)
let animationFrame = null
let paddleMoveDir = 0

const bricks = ref([])

function initBricks () {
  bricks.value = []
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 8; col++) {
      bricks.value.push({
        x: col * 50,
        y: row * 30 + 50,
        width: 48,
        height: 28,
        destroyed: false
      })
    }
  }
}

function movePaddle (e) {
  const rect = gameCanvas.value.getBoundingClientRect()
  paddleX.value = e.clientX - rect.left - 50
  if (paddleX.value < 0) paddleX.value = 0
  if (paddleX.value > 300) paddleX.value = 300
}

function handleTouchMove (e) {
  const rect = gameCanvas.value.getBoundingClientRect()
  const touch = e.touches[0]
  paddleX.value = touch.clientX - rect.left - 50
  if (paddleX.value < 0) paddleX.value = 0
  if (paddleX.value > 300) paddleX.value = 300
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

function draw () {
  const ctx = gameCanvas.value.getContext('2d')
  
  if (paddleMoveDir !== 0) {
    paddleX.value += paddleMoveDir * 5
    if (paddleX.value < 0) paddleX.value = 0
    if (paddleX.value > 300) paddleX.value = 300
  }
  
  ctx.clearRect(0, 0, 400, 500)
  
  ctx.fillStyle = '#1976d2'
  ctx.fillRect(paddleX.value, 480, 100, 10)
  
  ctx.beginPath()
  ctx.arc(ballX.value, ballY.value, 10, 0, Math.PI * 2)
  ctx.fillStyle = '#d32f2f'
  ctx.fill()
  
  bricks.value.forEach(brick => {
    if (!brick.destroyed) {
      ctx.fillStyle = '#4caf50'
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height)
      ctx.strokeStyle = '#2e7d32'
      ctx.strokeRect(brick.x, brick.y, brick.width, brick.height)
    }
  })
  
  ballX.value += ballDX.value
  ballY.value += ballDY.value
  
  if (ballX.value < 10 || ballX.value > 390) {
    ballDX.value = -ballDX.value
  }
  
  if (ballY.value < 10) {
    ballDY.value = -ballDY.value
  }
  
  if (ballY.value > 470 && ballX.value > paddleX.value && ballX.value < paddleX.value + 100) {
    ballDY.value = -ballDY.value
  }
  
  bricks.value.forEach(brick => {
    if (!brick.destroyed &&
        ballX.value > brick.x && ballX.value < brick.x + brick.width &&
        ballY.value > brick.y && ballY.value < brick.y + brick.height) {
      brick.destroyed = true
      ballDY.value = -ballDY.value
      score.value += 10
    }
  })
  
  if (ballY.value > 500) {
    resetGame()
  }
  
  animationFrame = requestAnimationFrame(draw)
}

function resetGame () {
  score.value = 0
  ballX.value = 200
  ballY.value = 250
  ballDX.value = 3
  ballDY.value = -3
  paddleX.value = 150
  initBricks()
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  draw()
}

onMounted(() => {
  initBricks()
  draw()
})

onBeforeUnmount(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<style scoped>
.game-container {
  width: 100%;
  max-width: 500px;
}

.brick-canvas {
  width: 100%;
  max-width: 400px;
  border: 2px solid #333;
  border-radius: 8px;
  background: #000;
  cursor: none;
  touch-action: none;
}

.mobile-controls-brick {
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
