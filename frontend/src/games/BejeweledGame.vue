<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Bejeweled</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Score: {{ score }}</div>
        </div>
        <div class="bejeweled-grid">
          <div v-for="(row, i) in grid" :key="i" class="bejeweled-row">
            <div
              v-for="(gem, j) in row"
              :key="j"
              :class="['bejeweled-gem', `gem-${gem}`]"
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
    Array(8).fill(null).map(() => Math.floor(Math.random() * 6) + 1)
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
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 6; j++) {
      if (grid.value[i][j] === grid.value[i][j + 1] && grid.value[i][j] === grid.value[i][j + 2]) {
        grid.value[i][j] = Math.floor(Math.random() * 6) + 1
        grid.value[i][j + 1] = Math.floor(Math.random() * 6) + 1
        grid.value[i][j + 2] = Math.floor(Math.random() * 6) + 1
        score.value += 30
      }
    }
  }
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
.bejeweled-grid { display: inline-block; border: 2px solid #333; }
.bejeweled-row { display: flex; }
.bejeweled-gem { width: 40px; height: 40px; border: 1px solid #ccc; cursor: pointer; border-radius: 8px; }
.gem-1 { background: #f44336; }
.gem-2 { background: #2196F3; }
.gem-3 { background: #4CAF50; }
.gem-4 { background: #FF9800; }
.gem-5 { background: #9C27B0; }
.gem-6 { background: #00BCD4; }
</style>
