<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Bowling</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Score: {{ score }}</div>
          <div class="text-caption">Click to roll</div>
        </div>
        <canvas ref="canvas" width="400" height="200" class="bowling-canvas" @click="roll" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const canvas = ref(null)
const score = ref(0)
let pins = Array(10).fill(true)
let ballX = 0
let ballY = 150

function roll () {
  ballX = 0
  ballY = 150
  const hit = Math.random() > 0.3
  if (hit) {
    const knocked = Math.floor(Math.random() * 10) + 1
    pins = pins.map((_, i) => i < knocked ? false : true)
    score.value += knocked
  }
  draw()
}

function draw () {
  const ctx = canvas.value.getContext('2d')
  ctx.clearRect(0, 0, 400, 200)
  ctx.fillStyle = '#8B4513'
  ctx.fillRect(0, 150, 400, 50)
  
  pins.forEach((pin, i) => {
    if (pin) {
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(200 + (i % 5 - 2) * 30, 50 + Math.floor(i / 5) * 20, 8, 0, Math.PI * 2)
      ctx.fill()
    }
  })
  
  ctx.fillStyle = '#000'
  ctx.beginPath()
  ctx.arc(ballX, ballY, 10, 0, Math.PI * 2)
  ctx.fill()
}

function resetGame () {
  score.value = 0
  pins = Array(10).fill(true)
  draw()
}

onMounted(() => {
  draw()
})
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
.bowling-canvas { border: 2px solid #333; border-radius: 8px; cursor: pointer; }
</style>
