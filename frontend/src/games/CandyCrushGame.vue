<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Candy Crush</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Score: {{ score }}</div>
          <div class="text-caption">Swap candies to match 3+</div>
        </div>
        <div class="candy-grid">
          <div v-for="(row, i) in grid" :key="i" class="candy-row">
            <div
              v-for="(candy, j) in row"
              :key="j"
              :class="['candy-cell', `candy-${candy}`]"
              @click="select(i, j)"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const grid = ref([])
const score = ref(0)
const selected = ref(null)

function initGrid () {
  grid.value = Array(8).fill(null).map(() => 
    Array(8).fill(null).map(() => Math.floor(Math.random() * 5) + 1)
  )
}

function select (row, col) {
  if (selected.value) {
    const [r1, c1] = selected.value
    if ((Math.abs(r1 - row) === 1 && c1 === col) || (r1 === row && Math.abs(c1 - col) === 1)) {
      [grid.value[r1][c1], grid.value[row][col]] = [grid.value[row][col], grid.value[r1][c1]]
      checkMatches()
    }
    selected.value = null
  } else {
    selected.value = [row, col]
  }
}

function checkMatches () {
  let matched = false
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (j < 6 && grid.value[i][j] === grid.value[i][j + 1] && grid.value[i][j] === grid.value[i][j + 2]) {
        grid.value[i][j] = Math.floor(Math.random() * 5) + 1
        grid.value[i][j + 1] = Math.floor(Math.random() * 5) + 1
        grid.value[i][j + 2] = Math.floor(Math.random() * 5) + 1
        score.value += 30
        matched = true
      }
    }
  }
  if (matched) setTimeout(checkMatches, 500)
}

function resetGame () {
  score.value = 0
  selected.value = null
  initGrid()
}

initGrid()
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
.candy-grid { display: inline-block; border: 2px solid #333; }
.candy-row { display: flex; }
.candy-cell { width: 40px; height: 40px; border: 1px solid #ccc; cursor: pointer; }
.candy-1 { background: #f44336; }
.candy-2 { background: #2196F3; }
.candy-3 { background: #4CAF50; }
.candy-4 { background: #FF9800; }
.candy-5 { background: #9C27B0; }
</style>
