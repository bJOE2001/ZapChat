<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Monopoly</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Player {{ currentPlayer }}'s Turn</div>
          <div class="text-h6 q-mt-sm">Position: {{ positions[currentPlayer - 1] }}/40</div>
          <div class="text-h6 q-mt-sm">Money: ${{ money[currentPlayer - 1] }}</div>
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
const positions = ref([0, 0, 0, 0])
const money = ref([1500, 1500, 1500, 1500])

function rollDice () {
  const dice = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1
  positions.value[currentPlayer.value - 1] = (positions.value[currentPlayer.value - 1] + dice) % 40
  money.value[currentPlayer.value - 1] += 200
  currentPlayer.value = currentPlayer.value === 4 ? 1 : currentPlayer.value + 1
}

function resetGame () {
  currentPlayer.value = 1
  positions.value = [0, 0, 0, 0]
  money.value = [1500, 1500, 1500, 1500]
}
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
</style>
