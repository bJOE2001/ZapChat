<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Ludo</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Player {{ currentPlayer }}'s Turn</div>
          <div class="text-h6 q-mt-sm">Dice: {{ diceValue }}</div>
        </div>
        <div class="ludo-board">
          <div class="ludo-cell" v-for="i in 52" :key="i">
            <div v-if="pieces.some(p => p.position === i)" class="ludo-piece" :style="{ background: pieces.find(p => p.position === i)?.color }"></div>
          </div>
        </div>
        <div class="text-center q-mt-md">
          <q-btn color="primary" label="Roll Dice" @click="rollDice" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const currentPlayer = ref(1)
const diceValue = ref(1)
const pieces = ref([
  { id: 1, position: 0, color: '#f44336' },
  { id: 2, position: 0, color: '#2196F3' },
  { id: 3, position: 0, color: '#4CAF50' },
  { id: 4, position: 0, color: '#FF9800' }
])

function rollDice () {
  diceValue.value = Math.floor(Math.random() * 6) + 1
  const piece = pieces.value.find(p => p.id === currentPlayer.value)
  if (piece) {
    piece.position = (piece.position + diceValue.value) % 52
  }
  currentPlayer.value = currentPlayer.value === 4 ? 1 : currentPlayer.value + 1
}

function resetGame () {
  currentPlayer.value = 1
  diceValue.value = 1
  pieces.value = [
    { id: 1, position: 0, color: '#f44336' },
    { id: 2, position: 0, color: '#2196F3' },
    { id: 3, position: 0, color: '#4CAF50' },
    { id: 4, position: 0, color: '#FF9800' }
  ]
}
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
.ludo-board { display: grid; grid-template-columns: repeat(13, 1fr); gap: 2px; width: 400px; margin: 0 auto; }
.ludo-cell { width: 30px; height: 30px; border: 1px solid #333; background: #fff; position: relative; }
.ludo-piece { width: 25px; height: 25px; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
</style>
