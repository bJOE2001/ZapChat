<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Asteroids</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Score: {{ score }}</div>
          <div class="text-caption">Use buttons to control</div>
        </div>
        <canvas ref="canvas" width="400" height="400" class="game-canvas" />
        <div class="row justify-center q-mt-md">
          <div class="mobile-controls-asteroids">
            <div class="control-row">
              <q-btn
                unelevated
                round
                color="primary"
                icon="arrow_back"
                size="lg"
                class="control-btn"
                @mousedown="rotateLeft"
                @touchstart.prevent="rotateLeft"
                @mouseup="stopRotate"
                @touchend="stopRotate"
              />
              <q-btn
                unelevated
                round
                color="primary"
                icon="arrow_forward"
                size="lg"
                class="control-btn"
                @mousedown="rotateRight"
                @touchstart.prevent="rotateRight"
                @mouseup="stopRotate"
                @touchend="stopRotate"
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
let ctx = null
let ship = { x: 200, y: 200, angle: 0 }
let bullets = []
let asteroids = []
let rotateDir = 0

function rotateLeft () {
  rotateDir = -1
}

function rotateRight () {
  rotateDir = 1
}

function stopRotate () {
  rotateDir = 0
}

function shoot () {
  bullets.push({ x: ship.x, y: ship.y, angle: ship.angle })
}

function resetGame () {
  score.value = 0
  ship = { x: 200, y: 200, angle: 0 }
  bullets = []
  asteroids = [{ x: 100, y: 100, size: 30, vx: 2, vy: 2 }]
  rotateDir = 0
  draw()
}

function draw () {
  if (!ctx) return
  ctx.clearRect(0, 0, 400, 400)
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, 400, 400)
  
  if (rotateDir !== 0) {
    ship.angle += rotateDir * 0.1
  }
  
  ctx.save()
  ctx.translate(ship.x, ship.y)
  ctx.rotate(ship.angle)
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.moveTo(0, -10)
  ctx.lineTo(-5, 10)
  ctx.lineTo(5, 10)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
  
  bullets.forEach((b, i) => {
    ctx.fillStyle = '#fff'
    ctx.fillRect(b.x, b.y, 3, 3)
    b.x += Math.cos(b.angle) * 5
    b.y += Math.sin(b.angle) * 5
    if (b.x < 0 || b.x > 400 || b.y < 0 || b.y > 400) {
      bullets.splice(i, 1)
    }
  })
  
  asteroids.forEach(a => {
    ctx.strokeStyle = '#fff'
    ctx.beginPath()
    ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2)
    ctx.stroke()
    a.x += a.vx
    a.y += a.vy
    if (a.x < 0) a.x = 400
    if (a.x > 400) a.x = 0
    if (a.y < 0) a.y = 400
    if (a.y > 400) a.y = 0
  })
  
  requestAnimationFrame(draw)
}

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  resetGame()
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') rotateLeft()
    if (e.key === 'ArrowRight') rotateRight()
    if (e.key === ' ') shoot()
  })
  document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') stopRotate()
  })
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', () => {})
  document.removeEventListener('keyup', () => {})
})
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
.game-canvas { border: 2px solid #333; border-radius: 8px; background: #000; }
.mobile-controls-asteroids {
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
