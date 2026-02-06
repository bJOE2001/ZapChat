<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Dice Roll</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h2">{{ diceValue }}</div>
          <div class="text-h6 q-mt-md">Total: {{ total }}</div>
        </div>
        <div class="text-center q-mt-lg">
          <q-btn color="primary" size="lg" label="Roll Dice" @click="roll" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const diceValue = ref(1)
const total = ref(0)

function roll () {
  diceValue.value = Math.floor(Math.random() * 6) + 1
  total.value += diceValue.value
}

function resetGame () {
  diceValue.value = 1
  total.value = 0
}
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
</style>
