<template>
  <q-page class="tic-tac-toe-page">
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/games')" />
      <q-toolbar-title class="text-weight-bold">Tic Tac Toe</q-toolbar-title>
      <q-btn flat round dense icon="refresh" @click="resetGame" />
    </q-toolbar>

    <div class="q-pa-md">
      <div class="row justify-center q-mb-md">
        <div class="text-h6">{{ currentPlayer === 'X' ? 'Your Turn (X)' : 'AI Turn (O)' }}</div>
        <q-space />
        <div class="text-h6">Wins: {{ wins }}</div>
      </div>

      <div class="row justify-center">
        <div class="board">
          <div
            v-for="(cell, index) in board"
            :key="index"
            class="cell"
            :class="{ 'cell-winner': winnerCells.includes(index) }"
            @click="makeMove(index)"
          >
            {{ cell }}
          </div>
        </div>
      </div>

      <q-banner v-if="winner" class="q-mt-md" :class="winner === 'X' ? 'bg-positive' : 'bg-negative'">
        <template v-slot:avatar>
          <q-icon :name="winner === 'X' ? 'celebration' : 'mood_bad'" />
        </template>
        {{ winner === 'X' ? 'You Win!' : 'AI Wins!' }}
      </q-banner>

      <q-banner v-if="draw" class="bg-grey q-mt-md">
        <template v-slot:avatar>
          <q-icon name="sentiment_neutral" />
        </template>
        It's a Draw!
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const board = ref(Array(9).fill(''))
const currentPlayer = ref('X')
const winner = ref(null)
const draw = ref(false)
const winnerCells = ref([])
const wins = ref(0)

function makeMove (index) {
  if (board.value[index] || winner.value || draw.value) return
  board.value[index] = currentPlayer.value
  checkWinner()
  if (!winner.value && !draw.value) {
    currentPlayer.value = 'O'
    setTimeout(() => aiMove(), 500)
  }
}

function aiMove () {
  const emptyCells = board.value.map((cell, index) => cell === '' ? index : null).filter(val => val !== null)
  if (emptyCells.length === 0) return
  
  let move = findWinningMove('O')
  if (move === null) move = findWinningMove('X')
  if (move === null) move = emptyCells[Math.floor(Math.random() * emptyCells.length)]
  
  board.value[move] = 'O'
  currentPlayer.value = 'X'
  checkWinner()
}

function findWinningMove (player) {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
  for (const line of lines) {
    const values = line.map(i => board.value[i])
    if (values.filter(v => v === player).length === 2 && values.includes('')) {
      return line[values.indexOf('')]
    }
  }
  return null
}

function checkWinner () {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
  for (const line of lines) {
    const [a, b, c] = line
    if (board.value[a] && board.value[a] === board.value[b] && board.value[a] === board.value[c]) {
      winner.value = board.value[a]
      winnerCells.value = line
      if (winner.value === 'X') wins.value++
      return
    }
  }
  if (board.value.every(cell => cell !== '')) {
    draw.value = true
  }
}

function resetGame () {
  board.value = Array(9).fill('')
  currentPlayer.value = 'X'
  winner.value = null
  draw.value = false
  winnerCells.value = []
}
</script>

<style scoped>
.tic-tac-toe-page {
  background: #f5f5f5;
}

.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  background: #333;
  padding: 4px;
  border-radius: 8px;
  max-width: 300px;
}

.cell {
  width: 90px;
  height: 90px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;
}

.cell:hover:not(.cell-winner) {
  background: #e3f2fd;
}

.cell-winner {
  background: #c8e6c9;
}
</style>
