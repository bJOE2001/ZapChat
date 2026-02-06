<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Galaga</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Score: {{ score }}</div>
          <div class="text-caption">Use buttons to control</div>
        </div>
        <canvas ref="canvas" width="400" height="500" class="galaga-canvas" />
        <div class="row justify-center q-mt-md">
          <div class="mobile-controls-galaga">
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
                icon="arrow_forward"
                size="lg"
                class="control-btn"
                @click="moveRight"
              />
            </div>
            <div class="control-row q-mt-sm">
              <q-btn
                unelevated
                color="secondary"
                label="Shoot"
                size="lg"
                class="control-btn shoot-btn"
                @click="shoot"
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
let ship = { x: 200 }
let bullets = []
let enemies = []

function resetGame () {
  score.value = 0
  ship = { x: 200 }
  bullets = []
  enemies = Array(10).fill(null).map((_, i) => ({
    x: (i % 5) * 80 + 40,
    y: Math.floor(i / 5) * 60 + 50
  }))
  draw()
}

function draw () {
  const ctx = canvas.value.getContext('2d')
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, 400, 500)
  
  ctx.fillStyle = '#fff'
  ctx.fillRect(ship.x, 450, 30, 20)
  
  bullets.forEach((b, i) => {
    ctx.fillRect(b.x, b.y, 3, 10)
    b.y -= 5
    if (b.y < 0) bullets.splice(i, 1)
  })
  
  enemies.forEach((e, i) => {
    ctx.fillStyle = '#f44336'
    ctx.fillRect(e.x, e.y, 20, 20)
    e.y += 0.1
    
    bullets.forEach((b, bi) => {
      if (Math.abs(b.x - e.x) < 20 && Math.abs(b.y - e.y) < 20) {
        enemies.splice(i, 1)
        bullets.splice(bi, 1)
        score.value += 10
      }
    })
  })
  
  requestAnimationFrame(draw)
}

function moveLeft () {
  ship.x -= 10
  if (ship.x < 0) ship.x = 0
}

function moveRight () {
  ship.x += 10
  if (ship.x > 370) ship.x = 370
}

function shoot () {
  bullets.push({ x: ship.x + 15, y: 450 })
}

onMounted(() => {
  resetGame()
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveLeft()
    if (e.key === 'ArrowRight') moveRight()
    if (e.key === ' ') shoot()
  })
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', () => {})
})
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
.galaga-canvas { border: 2px solid #333; border-radius: 8px; background: #000; }
.mobile-controls-galaga {
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
.shoot-btn {
  min-width: 120px;
}
</style>
