<template>
  <q-page class="game-2048-page">
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/games')" />
      <q-toolbar-title class="text-weight-bold">2048</q-toolbar-title>
      <q-btn flat round dense icon="refresh" @click="newGame" />
    </q-toolbar>

    <div class="q-pa-md">
      <div class="row justify-center q-mb-md">
        <div class="text-h6">Score: {{ score }}</div>
        <q-space />
        <div class="text-h6">Best: {{ bestScore }}</div>
      </div>

      <div class="row justify-center">
        <div class="game-board">
          <div
            v-for="(row, rowIdx) in grid"
            :key="rowIdx"
            class="board-row"
          >
            <div
              v-for="(cell, colIdx) in row"
              :key="colIdx"
              class="board-cell"
              :class="`cell-${cell || 0}`"
            >
              {{ cell || '' }}
            </div>
          </div>
        </div>
      </div>

      <div class="row justify-center q-mt-md">
        <div class="text-center text-body2 text-grey-7">
          Use Arrow Keys to Play
        </div>
      </div>

      <q-banner v-if="gameWon" class="bg-positive text-white q-mt-md">
        <template v-slot:avatar>
          <q-icon name="celebration" />
        </template>
        You reached 2048! Keep going?
      </q-banner>

      <q-banner v-if="gameOver" class="bg-negative text-white q-mt-md">
        <template v-slot:avatar>
          <q-icon name="mood_bad" />
        </template>
        Game Over! Final Score: {{ score }}
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const grid = ref([])
const score = ref(0)
const bestScore = ref(parseInt(localStorage.getItem('2048Best') || '0'))
const gameWon = ref(false)
const gameOver = ref(false)
const size = 4

function initGrid () {
  grid.value = Array(size).fill(null).map(() => Array(size).fill(null))
  addRandomTile()
  addRandomTile()
}

function addRandomTile () {
  const emptyCells = []
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (!grid.value[i][j]) {
        emptyCells.push({ row: i, col: j })
      }
    }
  }
  if (emptyCells.length > 0) {
    const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    grid.value[cell.row][cell.col] = Math.random() < 0.9 ? 2 : 4
  }
}

function moveLeft () {
  let moved = false
  for (let i = 0; i < size; i++) {
    const row = grid.value[i].filter(cell => cell !== null)
    const merged = []
    for (let j = 0; j < row.length; j++) {
      if (j < row.length - 1 && row[j] === row[j + 1]) {
        merged.push(row[j] * 2)
        score.value += row[j] * 2
        j++
      } else {
        merged.push(row[j])
      }
    }
    while (merged.length < size) merged.push(null)
    if (JSON.stringify(grid.value[i]) !== JSON.stringify(merged)) {
      moved = true
    }
    grid.value[i] = merged
  }
  if (moved) {
    addRandomTile()
    checkGameState()
  }
}

function moveRight () {
  for (let i = 0; i < size; i++) {
    grid.value[i] = grid.value[i].reverse()
  }
  moveLeft()
  for (let i = 0; i < size; i++) {
    grid.value[i] = grid.value[i].reverse()
  }
}

function moveUp () {
  transpose()
  moveLeft()
  transpose()
}

function moveDown () {
  transpose()
  moveRight()
  transpose()
}

function transpose () {
  for (let i = 0; i < size; i++) {
    for (let j = i + 1; j < size; j++) {
      [grid.value[i][j], grid.value[j][i]] = [grid.value[j][i], grid.value[i][j]]
    }
  }
}

function checkGameState () {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid.value[i][j] === 2048) {
        gameWon.value = true
      }
    }
  }
  
  let hasEmpty = false
  let canMove = false
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (!grid.value[i][j]) hasEmpty = true
      if (j < size - 1 && grid.value[i][j] === grid.value[i][j + 1]) canMove = true
      if (i < size - 1 && grid.value[i][j] === grid.value[i + 1][j]) canMove = true
    }
  }
  
  if (!hasEmpty && !canMove) {
    gameOver.value = true
  }
  
  if (score.value > bestScore.value) {
    bestScore.value = score.value
    localStorage.setItem('2048Best', score.value.toString())
  }
}

function handleKeyPress (e) {
  if (gameOver.value) return
  if (e.key === 'ArrowLeft') moveLeft()
  else if (e.key === 'ArrowRight') moveRight()
  else if (e.key === 'ArrowUp') moveUp()
  else if (e.key === 'ArrowDown') moveDown()
}

function newGame () {
  grid.value = []
  score.value = 0
  gameWon.value = false
  gameOver.value = false
  initGrid()
}

onMounted(() => {
  initGrid()
  window.addEventListener('keydown', handleKeyPress)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyPress)
})
</script>

<style scoped>
.game-2048-page {
  background: #f5f5f5;
}

.game-board {
  background: #bbada0;
  border-radius: 8px;
  padding: 8px;
}

.board-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.board-row:last-child {
  margin-bottom: 0;
}

.board-cell {
  width: 70px;
  height: 70px;
  background: #cdc1b4;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: #776e65;
}

.cell-2 { background: #eee4da; }
.cell-4 { background: #ede0c8; }
.cell-8 { background: #f2b179; color: white; }
.cell-16 { background: #f59563; color: white; }
.cell-32 { background: #f67c5f; color: white; }
.cell-64 { background: #f65e3b; color: white; }
.cell-128 { background: #edcf72; color: white; font-size: 20px; }
.cell-256 { background: #edcc61; color: white; font-size: 20px; }
.cell-512 { background: #edc850; color: white; font-size: 20px; }
.cell-1024 { background: #edc53f; color: white; font-size: 18px; }
.cell-2048 { background: #edc22e; color: white; font-size: 18px; }
</style>
