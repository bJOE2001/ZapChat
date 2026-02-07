<template>
  <q-page class="simon-page">
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/games')" />
      <q-toolbar-title class="text-weight-bold">Simon Says</q-toolbar-title>
      <q-btn flat round dense icon="refresh" @click="newGame" />
    </q-toolbar>

    <div class="q-pa-md">
      <div class="row justify-center q-mb-md">
        <div class="text-h6">Level: {{ level }}</div>
        <q-space />
        <div class="text-h6">Score: {{ score }}</div>
      </div>

      <div class="row justify-center">
        <div class="simon-board">
          <q-btn
            v-for="(color, index) in colors"
            :key="index"
            :class="`simon-button ${color}`"
            :class="{ 'active': activeButton === index, 'disabled': !canClick }"
            :disable="!canClick"
            size="xl"
            @click="clickButton(index)"
          />
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
import { ref } from 'vue'

const colors = ['red', 'green', 'blue', 'yellow']
const sequence = ref([])
const playerSequence = ref([])
const activeButton = ref(null)
const canClick = ref(false)
const level = ref(1)
const score = ref(0)
const gameOver = ref(false)

function playSequence () {
  canClick.value = false
  let i = 0
  const playNext = () => {
    if (i < sequence.value.length) {
      activeButton.value = sequence.value[i]
      setTimeout(() => {
        activeButton.value = null
        i++
        setTimeout(playNext, 300)
      }, 500)
    } else {
      canClick.value = true
      playerSequence.value = []
    }
  }
  playNext()
}

function clickButton (index) {
  if (!canClick.value || gameOver.value) return
  
  activeButton.value = index
  playerSequence.value.push(index)
  
  setTimeout(() => {
    activeButton.value = null
    
    if (playerSequence.value[playerSequence.value.length - 1] !== sequence.value[playerSequence.value.length - 1]) {
      gameOver.value = true
      return
    }
    
    if (playerSequence.value.length === sequence.value.length) {
      level.value++
      score.value += 10
      addToSequence()
      setTimeout(() => playSequence(), 1000)
    }
  }, 200)
}

function addToSequence () {
  sequence.value.push(Math.floor(Math.random() * 4))
}

function newGame () {
  sequence.value = []
  playerSequence.value = []
  level.value = 1
  score.value = 0
  gameOver.value = false
  addToSequence()
  setTimeout(() => playSequence(), 500)
}

newGame()
</script>

<style scoped>
.simon-page {
  background: #f5f5f5;
}

.simon-board {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-width: 400px;
}

.simon-button {
  width: 150px;
  height: 150px;
  border-radius: 8px;
  opacity: 0.6;
}

.simon-button.red { background: #f44336; }
.simon-button.green { background: #4caf50; }
.simon-button.blue { background: #2196f3; }
.simon-button.yellow { background: #ffeb3b; }

.simon-button.active {
  opacity: 1;
  transform: scale(1.1);
}

.simon-button.disabled {
  cursor: not-allowed;
}
</style>
