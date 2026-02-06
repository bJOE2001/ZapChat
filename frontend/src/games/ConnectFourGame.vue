<template>
  <q-page class="connect-four-page">
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/games')" />
      <q-toolbar-title class="text-weight-bold">Connect Four</q-toolbar-title>
      <q-btn flat round dense icon="refresh" @click="resetGame" />
    </q-toolbar>

    <div class="q-pa-md">
      <div class="row justify-center q-mb-md">
        <div class="text-h6">{{ currentPlayer === 'red' ? 'Your Turn (Red)' : 'AI Turn (Yellow)' }}</div>
        <q-space />
        <div class="text-h6">Wins: {{ wins }}</div>
      </div>

      <div class="row justify-center">
        <div class="connect-board">
          <div
            v-for="(row, rowIdx) in board"
            :key="rowIdx"
            class="board-row"
          >
            <div
              v-for="(cell, colIdx) in row"
              :key="colIdx"
              class="board-cell"
              :class="`cell-${cell || 'empty'}`"
              @click="dropPiece(colIdx)"
            >
              <div v-if="cell" class="piece" :class="cell"></div>
            </div>
          </div>
        </div>
      </div>

      <q-banner v-if="winner" class="q-mt-md" :class="winner === 'red' ? 'bg-negative' : 'bg-warning'">
        <template v-slot:avatar>
          <q-icon :name="winner === 'red' ? 'celebration' : 'mood_bad'" />
        </template>
        {{ winner === 'red' ? 'You Win!' : 'AI Wins!' }}
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const ROWS = 6
const COLS = 7
const board = ref([])
const currentPlayer = ref('red')
const winner = ref(null)
const wins = ref(0)

function initBoard () {
  board.value = Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
}

function dropPiece (col) {
  if (winner.value || currentPlayer.value !== 'red') return
  
  for (let row = ROWS - 1; row >= 0; row--) {
    if (!board.value[row][col]) {
      board.value[row][col] = currentPlayer.value
      checkWinner()
      if (!winner.value) {
        currentPlayer.value = 'yellow'
        setTimeout(() => aiMove(), 500)
      } else if (winner.value === 'red') {
        wins.value++
      }
      return
    }
  }
}

function aiMove () {
  let move = findWinningMove('yellow')
  if (move === null) move = findWinningMove('red')
  if (move === null) move = Math.floor(Math.random() * COLS)
  
  for (let row = ROWS - 1; row >= 0; row--) {
    if (!board.value[row][move]) {
      board.value[row][move] = 'yellow'
      currentPlayer.value = 'red'
      checkWinner()
      return
    }
  }
}

function findWinningMove (player) {
  for (let col = 0; col < COLS; col++) {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!board.value[row][col]) {
        board.value[row][col] = player
        if (checkWin(player)) {
          board.value[row][col] = null
          return col
        }
        board.value[row][col] = null
        break
      }
    }
  }
  return null
}

function checkWinner () {
  if (checkWin('red')) {
    winner.value = 'red'
  } else if (checkWin('yellow')) {
    winner.value = 'yellow'
  }
}

function checkWin (player) {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS - 3; col++) {
      if (board.value[row][col] === player &&
          board.value[row][col + 1] === player &&
          board.value[row][col + 2] === player &&
          board.value[row][col + 3] === player) {
        return true
      }
    }
  }
  
  for (let row = 0; row < ROWS - 3; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board.value[row][col] === player &&
          board.value[row + 1][col] === player &&
          board.value[row + 2][col] === player &&
          board.value[row + 3][col] === player) {
        return true
      }
    }
  }
  
  for (let row = 0; row < ROWS - 3; row++) {
    for (let col = 0; col < COLS - 3; col++) {
      if (board.value[row][col] === player &&
          board.value[row + 1][col + 1] === player &&
          board.value[row + 2][col + 2] === player &&
          board.value[row + 3][col + 3] === player) {
        return true
      }
      if (board.value[row][col + 3] === player &&
          board.value[row + 1][col + 2] === player &&
          board.value[row + 2][col + 1] === player &&
          board.value[row + 3][col] === player) {
        return true
      }
    }
  }
  
  return false
}

function resetGame () {
  initBoard()
  currentPlayer.value = 'red'
  winner.value = null
}

resetGame()
</script>

<style scoped>
.connect-four-page {
  background: #f5f5f5;
}

.connect-board {
  background: #2196f3;
  border-radius: 8px;
  padding: 10px;
}

.board-row {
  display: flex;
  gap: 5px;
  margin-bottom: 5px;
}

.board-row:last-child {
  margin-bottom: 0;
}

.board-cell {
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.piece {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.piece.red {
  background: #f44336;
}

.piece.yellow {
  background: #ffeb3b;
}
</style>
