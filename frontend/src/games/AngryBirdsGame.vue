<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Angry Birds</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Score: {{ score }}</div>
          <div class="text-caption">Click to launch bird</div>
        </div>
        <canvas ref="canvas" width="400" height="300" class="angry-canvas" @click="launch" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const canvas = ref(null)
const score = ref(0)
let bird = { x: 50, y: 150, vx: 0, vy: 0 }
let targets = [{ x: 300, y: 200 }]

function launch () {
  bird.vx = 5
  bird.vy = -3
  draw()
}

function draw () {
  const ctx = canvas.value.getContext('2d')
  ctx.clearRect(0, 0, 400, 300)
  ctx.fillStyle = '#87CEEB'
  ctx.fillRect(0, 0, 400, 300)
  
  ctx.fillStyle = '#4CAF50'
  ctx.fillRect(0, 250, 400, 50)
  
  ctx.fillStyle = '#FFD700'
  ctx.beginPath()
  ctx.arc(bird.x, bird.y, 10, 0, Math.PI * 2)
  ctx.fill()
  
  bird.x += bird.vx
  bird.y += bird.vy
  bird.vy += 0.2
  
  targets.forEach((target, i) => {
    ctx.fillStyle = '#8B4513'
    ctx.fillRect(target.x, target.y, 30, 30)
    if (Math.abs(bird.x - target.x) < 30 && Math.abs(bird.y - target.y) < 30) {
      targets.splice(i, 1)
      score.value += 10
    }
  })
  
  requestAnimationFrame(draw)
}

function resetGame () {
  score.value = 0
  bird = { x: 50, y: 150, vx: 0, vy: 0 }
  targets = [{ x: 300, y: 200 }]
  draw()
}

onMounted(() => {
  draw()
})
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
.angry-canvas { border: 2px solid #333; border-radius: 8px; cursor: crosshair; }
</style>
