<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Bubble Shooter</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Score: {{ score }}</div>
          <div class="text-caption">Click to shoot</div>
        </div>
        <canvas ref="canvas" width="400" height="500" class="bubble-canvas" @click="shoot" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const canvas = ref(null)
const score = ref(0)
let bubbles = []
let shooter = { x: 200, angle: 0 }

function createBubbles () {
  bubbles = []
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 8; j++) {
      bubbles.push({
        x: j * 50 + 25,
        y: i * 50 + 50,
        color: ['#f44336', '#2196F3', '#4CAF50', '#FF9800'][Math.floor(Math.random() * 4)],
        popped: false
      })
    }
  }
}

function shoot (e) {
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const angle = Math.atan2(y - 450, x - 200)
  
  bubbles.forEach(bubble => {
    const dist = Math.sqrt(Math.pow(bubble.x - x, 2) + Math.pow(bubble.y - y, 2))
    if (dist < 25 && !bubble.popped) {
      bubble.popped = true
      score.value += 10
    }
  })
  
  draw()
}

function draw () {
  const ctx = canvas.value.getContext('2d')
  ctx.clearRect(0, 0, 400, 500)
  ctx.fillStyle = '#87CEEB'
  ctx.fillRect(0, 0, 400, 500)
  
  bubbles.forEach(bubble => {
    if (!bubble.popped) {
      ctx.fillStyle = bubble.color
      ctx.beginPath()
      ctx.arc(bubble.x, bubble.y, 20, 0, Math.PI * 2)
      ctx.fill()
    }
  })
  
  ctx.fillStyle = '#333'
  ctx.beginPath()
  ctx.arc(200, 450, 15, 0, Math.PI * 2)
  ctx.fill()
}

function resetGame () {
  score.value = 0
  createBubbles()
  draw()
}

onMounted(() => {
  createBubbles()
  draw()
})
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
.bubble-canvas { border: 2px solid #333; border-radius: 8px; cursor: crosshair; }
</style>
