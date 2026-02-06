<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Pac-Man</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Score: {{ score }}</div>
          <div class="text-caption">Use buttons to move</div>
        </div>
        <canvas ref="canvas" width="400" height="400" class="pacman-canvas" />
        <div class="row justify-center q-mt-md">
          <div class="mobile-controls-pacman">
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
let pacman = { x: 200, y: 200, direction: 0 }
let dots = []
let ghosts = []

function resetGame () {
  score.value = 0
  pacman = { x: 200, y: 200, direction: 0 }
  dots = Array(20).fill(null).map((_, i) => ({
    x: (i % 10) * 40 + 20,
    y: Math.floor(i / 10) * 40 + 20
  }))
  ghosts = [{ x: 100, y: 100 }, { x: 300, y: 100 }]
  draw()
}

function draw () {
  const ctx = canvas.value.getContext('2d')
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, 400, 400)
  
  dots.forEach((dot, i) => {
    if (dot) {
      ctx.fillStyle = '#FFD700'
      ctx.beginPath()
      ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2)
      ctx.fill()
      
      if (Math.abs(dot.x - pacman.x) < 10 && Math.abs(dot.y - pacman.y) < 10) {
        dots[i] = null
        score.value += 10
      }
    }
  })
  
  ctx.fillStyle = '#FFD700'
  ctx.beginPath()
  ctx.arc(pacman.x, pacman.y, 15, 0.2, Math.PI * 2 - 0.2)
  ctx.lineTo(pacman.x, pacman.y)
  ctx.closePath()
  ctx.fill()
  
  ghosts.forEach(ghost => {
    ctx.fillStyle = '#f44336'
    ctx.beginPath()
    ctx.arc(ghost.x, ghost.y, 15, 0, Math.PI * 2)
    ctx.fill()
  })
  
  requestAnimationFrame(draw)
}

function moveUp () {
  pacman.y -= 5
  if (pacman.y < 0) pacman.y = 400
}

function moveDown () {
  pacman.y += 5
  if (pacman.y > 400) pacman.y = 0
}

function moveLeft () {
  pacman.x -= 5
  if (pacman.x < 0) pacman.x = 400
}

function moveRight () {
  pacman.x += 5
  if (pacman.x > 400) pacman.x = 0
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
.pacman-canvas { border: 2px solid #333; border-radius: 8px; background: #000; }
.mobile-controls-pacman {
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
