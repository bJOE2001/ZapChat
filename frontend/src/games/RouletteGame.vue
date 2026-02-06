<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Roulette</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h2">{{ result }}</div>
          <div class="text-h6 q-mt-sm">Balance: ${{ balance }}</div>
        </div>
        <div class="text-center q-mt-md">
          <q-btn color="primary" label="Spin" @click="spin" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const result = ref('-')
const balance = ref(1000)

function spin () {
  result.value = Math.floor(Math.random() * 37)
  if (result.value === 0) {
    balance.value += 100
  } else if (result.value % 2 === 0) {
    balance.value += 10
  } else {
    balance.value -= 10
  }
}

function resetGame () {
  result.value = '-'
  balance.value = 1000
}
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
</style>
