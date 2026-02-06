<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Checkers</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>

      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Checkers</div>
          <div class="text-caption text-grey-7">Move your pieces diagonally</div>
        </div>

        <div class="checkers-board">
          <div
            v-for="(row, rowIndex) in board"
            :key="rowIndex"
            class="checkers-row"
          >
            <div
              v-for="(piece, colIndex) in row"
              :key="colIndex"
              :class="[
                'checkers-square',
                (rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark',
                selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex ? 'selected' : ''
              ]"
              @click="handleSquareClick(rowIndex, colIndex)"
            >
              <div
                v-if="piece"
                :class="['checker-piece', piece === 'r' ? 'red' : 'black']"
              />
            </div>
          </div>
        </div>

        <div class="q-mt-md text-center">
          <q-badge :color="currentPlayer === 'red' ? 'red' : 'black'">
            {{ currentPlayer === 'red' ? 'Red' : 'Black' }} to move
          </q-badge>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const board = ref([
  [null, 'r', null, 'r', null, 'r', null, 'r'],
  ['r', null, 'r', null, 'r', null, 'r', null],
  [null, 'r', null, 'r', null, 'r', null, 'r'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['b', null, 'b', null, 'b', null, 'b', null],
  [null, 'b', null, 'b', null, 'b', null, 'b'],
  ['b', null, 'b', null, 'b', null, 'b', null]
])

const currentPlayer = ref('red')
const selectedSquare = ref(null)

function handleSquareClick (row, col) {
  const piece = board.value[row][col]
  
  if (selectedSquare.value) {
    const { row: fromRow, col: fromCol } = selectedSquare.value
    if (row !== fromRow && col !== fromCol && !piece) {
      board.value[row][col] = board.value[fromRow][fromCol]
      board.value[fromRow][fromCol] = null
      currentPlayer.value = currentPlayer.value === 'red' ? 'black' : 'red'
    }
    selectedSquare.value = null
  } else if (piece === currentPlayer[0]) {
    selectedSquare.value = { row, col }
  }
}

function resetGame () {
  board.value = [
    [null, 'r', null, 'r', null, 'r', null, 'r'],
    ['r', null, 'r', null, 'r', null, 'r', null],
    [null, 'r', null, 'r', null, 'r', null, 'r'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['b', null, 'b', null, 'b', null, 'b', null],
    [null, 'b', null, 'b', null, 'b', null, 'b'],
    ['b', null, 'b', null, 'b', null, 'b', null]
  ]
  currentPlayer.value = 'red'
  selectedSquare.value = null
}
</script>

<style scoped>
.game-container {
  width: 100%;
  max-width: 500px;
}

.checkers-board {
  display: inline-block;
  border: 3px solid #8b4513;
  margin: 0 auto;
}

.checkers-row {
  display: flex;
}

.checkers-square {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.checkers-square.light {
  background-color: #f0d9b5;
}

.checkers-square.dark {
  background-color: #b58863;
}

.checkers-square.selected {
  background-color: #ffd700 !important;
}

.checker-piece {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 2px solid #333;
}

.checker-piece.red {
  background-color: #d32f2f;
}

.checker-piece.black {
  background-color: #212121;
}

@media (max-width: 600px) {
  .checkers-square {
    width: 35px;
    height: 35px;
  }
  
  .checker-piece {
    width: 25px;
    height: 25px;
  }
}
</style>
