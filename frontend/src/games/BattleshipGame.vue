<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Battleship</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Click to attack</div>
        </div>
        <div class="battleship-grid">
          <div v-for="(row, i) in 10" :key="i" class="grid-row">
            <div
              v-for="(col, j) in 10"
              :key="j"
              :class="['grid-cell', board[i][j]]"
              @click="attack(i, j)"
            />
          </div>
        </div>
        <div class="q-mt-md text-center">
          <q-badge>Hits: {{ hits }}</q-badge>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const board = ref([])
const hits = ref(0)

function initBoard () {
  board.value = Array(10).fill(null).map(() => Array(10).fill('water'))
  const ships = [5, 4, 3, 3, 2]
  ships.forEach(size => {
    const horizontal = Math.random() > 0.5
    let x = Math.floor(Math.random() * 10)
    let y = Math.floor(Math.random() * 10)
    if (horizontal && x + size > 10) x = 10 - size
    if (!horizontal && y + size > 10) y = 10 - size
    for (let i = 0; i < size; i++) {
      if (horizontal) board.value[y][x + i] = 'ship'
      else board.value[y + i][x] = 'ship'
    }
  })
}

function attack (row, col) {
  if (board.value[row][col] === 'ship') {
    board.value[row][col] = 'hit'
    hits.value++
  } else if (board.value[row][col] === 'water') {
    board.value[row][col] = 'miss'
  }
}

function resetGame () {
  hits.value = 0
  initBoard()
}

initBoard()
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
.battleship-grid { display: inline-block; border: 2px solid #333; }
.grid-row { display: flex; }
.grid-cell { width: 30px; height: 30px; border: 1px solid #ccc; cursor: pointer; }
.grid-cell.water { background: #2196F3; }
.grid-cell.ship { background: #4CAF50; }
.grid-cell.hit { background: #f44336; }
.grid-cell.miss { background: #fff; }
</style>
