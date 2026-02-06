<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Zombie Shooter</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Score: {{ score }}</div>
          <div class="text-h6">Zombies Killed: {{ kills }}</div>
        </div>
        <canvas ref="canvas" width="400" height="400" class="zombie-canvas" @click="shoot" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const canvas = ref(null)
const score = ref(0)
const kills = ref(0)
let zombies = []
let bullets = []

function resetGame () {
  score.value = 0
  kills.value = 0
  zombies = []
  bullets = []
  for (let i = 0; i < 5; i++) {
    zombies.push({
      x: Math.random() * 400,
      y: Math.random() * 400,
      speed: 0.5
    })
  }
  draw()
}

function shoot (e) {
  const rect = canvas.value.getBoundingClientRect()
  bullets.push({
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
    vx: (e.clientX - rect.left - 200) / 50,
    vy: (e.clientY - rect.top - 200) / 50
  })
}

function draw () {
  const ctx = canvas.value.getContext('2d')
  ctx.fillStyle = '#2d5016'
  ctx.fillRect(0, 0, 400, 400)
  
  zombies.forEach((zombie, zi) => {
    ctx.fillStyle = '#4CAF50'
    ctx.beginPath()
    ctx.arc(zombie.x, zombie.y, 15, 0, Math.PI * 2)
    ctx.fill()
    zombie.x += (200 - zombie.x) * 0.01
    zombie.y += (200 - zombie.y) * 0.01
    
    bullets.forEach((bullet, bi) => {
      if (Math.abs(bullet.x - zombie.x) < 20 && Math.abs(bullet.y - zombie.y) < 20) {
        zombies.splice(zi, 1)
        bullets.splice(bi, 1)
        kills.value++
        score.value += 10
        zombies.push({
          x: Math.random() * 400,
          y: Math.random() * 400,
          speed: 0.5
        })
      }
    })
  })
  
  bullets.forEach((bullet, bi) => {
    ctx.fillStyle = '#FFD700'
    ctx.fillRect(bullet.x, bullet.y, 5, 5)
    bullet.x += bullet.vx
    bullet.y += bullet.vy
    if (bullet.x < 0 || bullet.x > 400 || bullet.y < 0 || bullet.y > 400) {
      bullets.splice(bi, 1)
    }
  })
  
  requestAnimationFrame(draw)
}

onMounted(() => {
  resetGame()
})
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
.zombie-canvas { border: 2px solid #333; border-radius: 8px; cursor: crosshair; }
</style>
