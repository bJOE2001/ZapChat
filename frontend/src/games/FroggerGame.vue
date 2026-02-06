<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Frogger</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Score: {{ score }}</div>
          <div class="text-caption">Use buttons to move</div>
        </div>
        <canvas ref="canvas" width="400" height="400" class="frogger-canvas" />
        <div class="row justify-center q-mt-md">
          <div class="mobile-controls-frogger">
            <div class="control-row">
              <q-btn
                unelevated
                round
                color="primary"
                icon="arrow_upward"
                size="lg"
                class="control-btn"
                @click="moveUp"
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
                color="primary"
                icon="arrow_downward"
                size="lg"
                class="control-btn"
                @click="moveDown"
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
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvas = ref(null)
const score = ref(0)
let frog = { x: 200, y: 350 }
let cars = []

function resetGame () {
  score.value = 0
  frog = { x: 200, y: 350 }
  cars = Array(5).fill(null).map((_, i) => ({
    x: i * 80,
    y: 100 + i * 50,
    speed: (i % 2 === 0 ? 1 : -1) * 2
  }))
  draw()
}

function draw () {
  const ctx = canvas.value.getContext('2d')
  ctx.clearRect(0, 0, 400, 400)
  ctx.fillStyle = '#4CAF50'
  ctx.fillRect(0, 0, 400, 400)
  
  ctx.fillStyle = '#333'
  ctx.fillRect(0, 50, 400, 200)
  
  cars.forEach(car => {
    ctx.fillStyle = '#f44336'
    ctx.fillRect(car.x, car.y, 40, 30)
    car.x += car.speed
    if (car.x > 400) car.x = -40
    if (car.x < -40) car.x = 400
    
    if (Math.abs(car.x - frog.x) < 40 && Math.abs(car.y - frog.y) < 30) {
      resetGame()
    }
  })
  
  ctx.fillStyle = '#4CAF50'
  ctx.fillRect(frog.x, frog.y, 20, 20)
  
  if (frog.y < 50) {
    score.value += 10
    frog.y = 350
  }
  
  requestAnimationFrame(draw)
}

function moveUp () {
  frog.y -= 50
  if (frog.y < 0) frog.y = 0
}

function moveDown () {
  frog.y += 50
  if (frog.y > 380) frog.y = 380
}

function moveLeft () {
  frog.x -= 50
  if (frog.x < 0) frog.x = 0
}

function moveRight () {
  frog.x += 50
  if (frog.x > 380) frog.x = 380
}

onMounted(() => {
  resetGame()
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') moveUp()
    if (e.key === 'ArrowDown') moveDown()
    if (e.key === 'ArrowLeft') moveLeft()
    if (e.key === 'ArrowRight') moveRight()
  })
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', () => {})
})
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
.frogger-canvas { border: 2px solid #333; border-radius: 8px; }
.mobile-controls-frogger {
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
