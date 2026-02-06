<template>
  <q-page class="minesweeper-page">
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/games')" />
      <q-toolbar-title class="text-weight-bold">Minesweeper</q-toolbar-title>
      <q-btn flat round dense icon="refresh" @click="newGame" />
    </q-toolbar>

    <div class="q-pa-md">
      <div class="row justify-center q-mb-md">
        <div class="text-h6">Mines: {{ minesLeft }}</div>
        <q-space />
        <div class="text-h6">Time: {{ time }}</div>
      </div>

      <div class="row justify-center">
        <div class="minesweeper-grid">
          <div
            v-for="(row, rowIdx) in grid"
            :key="rowIdx"
            class="grid-row"
          >
            <div
              v-for="(cell, colIdx) in row"
              :key="colIdx"
              class="grid-cell"
              :class="{
                'revealed': cell.revealed,
                'flagged': cell.flagged,
                'mine': cell.revealed && cell.mine
              }"
              @click="revealCell(rowIdx, colIdx)"
              @contextmenu.prevent="flagCell(rowIdx, colIdx)"
            >
              <span v-if="cell.revealed && !cell.mine && cell.count > 0">{{ cell.count }}</span>
              <q-icon v-if="cell.flagged" name="flag" />
              <q-icon v-if="cell.revealed && cell.mine" name="dangerous" />
            </div>
          </div>
        </div>
      </div>

      <q-banner v-if="gameWon" class="bg-positive text-white q-mt-md">
        <template v-slot:avatar>
          <q-icon name="celebration" />
        </template>
        You Win!
      </q-banner>

      <q-banner v-if="gameOver" class="bg-negative text-white q-mt-md">
        <template v-slot:avatar>
          <q-icon name="mood_bad" />
        </template>
        Game Over! You hit a mine.
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const SIZE = 10
const MINES = 15
const grid = ref([])
const minesLeft = ref(MINES)
const gameOver = ref(false)
const gameWon = ref(false)
const time = ref(0)
let timer = null

function initGrid () {
  grid.value = Array(SIZE).fill(null).map(() => 
    Array(SIZE).fill(null).map(() => ({
      mine: false,
      revealed: false,
      flagged: false,
      count: 0
    }))
  )
  
  let placed = 0
  while (placed < MINES) {
    const row = Math.floor(Math.random() * SIZE)
    const col = Math.floor(Math.random() * SIZE)
    if (!grid.value[row][col].mine) {
      grid.value[row][col].mine = true
      placed++
    }
  }
  
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (!grid.value[row][col].mine) {
        let count = 0
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = row + dr
            const nc = col + dc
            if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && grid.value[nr][nc].mine) {
              count++
            }
          }
        }
        grid.value[row][col].count = count
      }
    }
  }
}

function revealCell (row, col) {
  if (gameOver.value || gameWon.value || grid.value[row][col].flagged || grid.value[row][col].revealed) return
  
  grid.value[row][col].revealed = true
  
  if (grid.value[row][col].mine) {
    gameOver.value = true
    return
  }
  
  if (grid.value[row][col].count === 0) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = row + dr
        const nc = col + dc
        if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && !grid.value[nr][nc].revealed) {
          revealCell(nr, nc)
        }
      }
    }
  }
  
  checkWin()
}

function flagCell (row, col) {
  if (gameOver.value || gameWon.value || grid.value[row][col].revealed) return
  
  grid.value[row][col].flagged = !grid.value[row][col].flagged
  minesLeft.value += grid.value[row][col].flagged ? -1 : 1
}

function checkWin () {
  let revealed = 0
  for (const row of grid.value) {
    for (const cell of row) {
      if (cell.revealed && !cell.mine) revealed++
    }
  }
  if (revealed === SIZE * SIZE - MINES) {
    gameWon.value = true
  }
}

function newGame () {
  gameOver.value = false
  gameWon.value = false
  minesLeft.value = MINES
  time.value = 0
  initGrid()
}

onMounted(() => {
  newGame()
  timer = setInterval(() => {
    if (!gameOver.value && !gameWon.value) {
      time.value++
    }
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.minesweeper-page {
  background: #f5f5f5;
}

.minesweeper-grid {
  border: 2px solid #333;
  display: inline-block;
}

.grid-row {
  display: flex;
}

.grid-cell {
  width: 30px;
  height: 30px;
  border: 1px solid #999;
  background: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bold;
}

.grid-cell.revealed {
  background: #fff;
  cursor: default;
}

.grid-cell.mine {
  background: #f44336;
}
</style>
