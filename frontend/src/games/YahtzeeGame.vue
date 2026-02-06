<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Yahtzee</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Score: {{ score }}</div>
          <div class="text-h6 q-mt-sm">Rolls: {{ rolls }}/3</div>
        </div>
        <div class="dice-area">
          <div v-for="(die, i) in dice" :key="i" class="dice" :class="{ held: die.held }" @click="toggleHold(i)">
            {{ die.value }}
          </div>
        </div>
        <div class="text-center q-mt-md">
          <q-btn color="primary" label="Roll" @click="roll" :disable="rolls >= 3" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const dice = ref(Array(5).fill(null).map(() => ({ value: 1, held: false })))
const score = ref(0)
const rolls = ref(0)

function roll () {
  dice.value.forEach(die => {
    if (!die.held) {
      die.value = Math.floor(Math.random() * 6) + 1
    }
  })
  rolls.value++
  if (rolls.value >= 3) {
    const values = dice.value.map(d => d.value)
    if (new Set(values).size === 1) {
      score.value += 50
    }
  }
}

function toggleHold (index) {
  dice.value[index].held = !dice.value[index].held
}

function resetGame () {
  dice.value = Array(5).fill(null).map(() => ({ value: 1, held: false }))
  score.value = 0
  rolls.value = 0
}
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
.dice-area { display: flex; gap: 10px; justify-content: center; }
.dice { width: 60px; height: 60px; border: 2px solid #333; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; background: #fff; }
.dice.held { background: #4CAF50; color: #fff; }
</style>
