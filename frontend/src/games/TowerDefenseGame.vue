<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Tower Defense</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Wave: {{ wave }}</div>
          <div class="text-h6">Lives: {{ lives }}</div>
        </div>
        <canvas ref="canvas" width="400" height="400" class="tower-canvas" @click="placeTower" />
        <div class="text-center q-mt-md">
          <q-btn color="primary" label="Start Wave" @click="startWave" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const canvas = ref(null)
const wave = ref(1)
const lives = ref(10)
let towers = []
let enemies = []
let path = [{ x: 0, y: 200 }, { x: 200, y: 200 }, { x: 200, y: 0 }, { x: 400, y: 0 }]

function placeTower (e) {
  const rect = canvas.value.getBoundingClientRect()
  towers.push({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  draw()
}

function startWave () {
  enemies = Array(5).fill(null).map((_, i) => ({ x: 0, y: 200, progress: 0 }))
  draw()
}

function draw () {
  const ctx = canvas.value.getContext('2d')
  ctx.clearRect(0, 0, 400, 400)
  ctx.strokeStyle = '#8B4513'
  ctx.lineWidth = 20
  ctx.beginPath()
  ctx.moveTo(path[0].x, path[0].y)
  path.forEach(p => ctx.lineTo(p.x, p.y))
  ctx.stroke()
  
  towers.forEach(tower => {
    ctx.fillStyle = '#2196F3'
    ctx.beginPath()
    ctx.arc(tower.x, tower.y, 15, 0, Math.PI * 2)
    ctx.fill()
  })
  
  enemies.forEach(enemy => {
    ctx.fillStyle = '#f44336'
    ctx.beginPath()
    ctx.arc(enemy.x, enemy.y, 10, 0, Math.PI * 2)
    ctx.fill()
  })
}

function resetGame () {
  wave.value = 1
  lives.value = 10
  towers = []
  enemies = []
  draw()
}

onMounted(() => {
  draw()
})
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
.tower-canvas { border: 2px solid #333; border-radius: 8px; background: #4CAF50; cursor: crosshair; }
</style>
