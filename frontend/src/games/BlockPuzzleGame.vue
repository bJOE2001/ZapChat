<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Block Puzzle</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Score: {{ score }}</div>
        </div>
        <div class="block-grid">
          <div v-for="(row, i) in 9" :key="i" class="block-row">
            <div
              v-for="(col, j) in 9"
              :key="j"
              :class="['block-cell', grid[i][j] ? 'filled' : '']"
              @click="toggle(i, j)"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const grid = ref(Array(9).fill(null).map(() => Array(9).fill(false)))
const score = ref(0)

function toggle (row, col) {
  grid.value[row][col] = !grid.value[row][col]
  checkLines()
}

function checkLines () {
  for (let i = 0; i < 9; i++) {
    if (grid.value[i].every(cell => cell)) {
      grid.value[i] = Array(9).fill(false)
      score.value += 10
    }
    if (grid.value.every(row => row[i])) {
      grid.value.forEach(row => row[i] = false)
      score.value += 10
    }
  }
}

function resetGame () {
  grid.value = Array(9).fill(null).map(() => Array(9).fill(false))
  score.value = 0
}
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
.block-grid { display: inline-block; border: 2px solid #333; }
.block-row { display: flex; }
.block-cell { width: 40px; height: 40px; border: 1px solid #ccc; cursor: pointer; background: #fff; }
.block-cell.filled { background: #2196F3; }
</style>
