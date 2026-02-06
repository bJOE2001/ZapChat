<template>
  <q-page class="whack-page">
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/games')" />
      <q-toolbar-title class="text-weight-bold">Whack a Mole</q-toolbar-title>
      <q-btn flat round dense icon="refresh" @click="restart" />
    </q-toolbar>

    <div class="q-pa-md">
      <div class="row justify-center q-mb-md">
        <div class="text-h6">Score: {{ score }}</div>
        <q-space />
        <div class="text-h6">Time: {{ timeLeft }}s</div>
      </div>

      <div class="row justify-center">
        <div class="mole-grid">
          <div
            v-for="(hole, index) in holes"
            :key="index"
            class="mole-hole"
            @click="whack(index)"
          >
            <q-icon
              v-if="hole.active"
              name="pets"
              size="64px"
              color="brown"
              class="mole"
            />
          </div>
        </div>
      </div>

      <q-banner v-if="gameOver" class="bg-negative text-white q-mt-md">
        <template v-slot:avatar>
          <q-icon name="mood_bad" />
        </template>
        Game Over! Final Score: {{ score }}
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const holes = ref(Array(9).fill(null).map(() => ({ active: false })))
const score = ref(0)
const timeLeft = ref(30)
const gameOver = ref(false)
let moleInterval = null
let timerInterval = null

function spawnMole () {
  if (gameOver.value) return
  const inactiveHoles = holes.value.map((h, i) => ({ ...h, index: i })).filter(h => !h.active)
  if (inactiveHoles.length > 0) {
    const randomHole = inactiveHoles[Math.floor(Math.random() * inactiveHoles.length)]
    randomHole.active = true
    setTimeout(() => {
      randomHole.active = false
    }, 1500)
  }
}

function whack (index) {
  if (holes.value[index].active && !gameOver.value) {
    holes.value[index].active = false
    score.value += 10
  }
}

function startGame () {
  moleInterval = setInterval(spawnMole, 1000)
  timerInterval = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      gameOver.value = true
      clearInterval(moleInterval)
      clearInterval(timerInterval)
    }
  }, 1000)
}

function restart () {
  holes.value = Array(9).fill(null).map(() => ({ active: false }))
  score.value = 0
  timeLeft.value = 30
  gameOver.value = false
  if (moleInterval) clearInterval(moleInterval)
  if (timerInterval) clearInterval(timerInterval)
  startGame()
}

onMounted(() => {
  startGame()
})

onBeforeUnmount(() => {
  if (moleInterval) clearInterval(moleInterval)
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<style scoped>
.whack-page {
  background: #f5f5f5;
}

.mole-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 500px;
}

.mole-hole {
  width: 120px;
  height: 120px;
  background: #8b4513;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 4px solid #654321;
  position: relative;
}

.mole {
  animation: pop 0.3s;
}

@keyframes pop {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
</style>
