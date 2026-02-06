<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Chess</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>

      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Chess Game</div>
          <div class="text-caption text-grey-7">Click squares to move pieces</div>
        </div>

        <div class="chess-board">
          <div
            v-for="(row, rowIndex) in board"
            :key="rowIndex"
            class="chess-row"
          >
            <div
              v-for="(piece, colIndex) in row"
              :key="colIndex"
              :class="[
                'chess-square',
                (rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark',
                selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex ? 'selected' : '',
                possibleMoves.some(m => m.row === rowIndex && m.col === colIndex) ? 'possible-move' : ''
              ]"
              @click="handleSquareClick(rowIndex, colIndex)"
            >
              <q-icon
                v-if="piece"
                :name="getPieceIcon(piece)"
                :color="piece.startsWith('w') ? 'white' : 'black'"
                size="40px"
              />
            </div>
          </div>
        </div>

        <div class="q-mt-md text-center">
          <q-badge :color="currentPlayer === 'white' ? 'white' : 'black'" :text-color="currentPlayer === 'white' ? 'black' : 'white'">
            {{ currentPlayer === 'white' ? 'White' : 'Black' }} to move
          </q-badge>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

const board = ref([
  ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
  ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
  ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
])

const currentPlayer = ref('white')
const selectedSquare = ref(null)
const possibleMoves = ref([])

function getPieceIcon (piece) {
  const icons = {
    'wp': 'pan_tool', 'wr': 'crop_square', 'wn': 'directions_horse', 'wb': 'change_circle',
    'wq': 'star', 'wk': 'workspace_premium',
    'bp': 'pan_tool', 'br': 'crop_square', 'bn': 'directions_horse', 'bb': 'change_circle',
    'bq': 'star', 'bk': 'workspace_premium'
  }
  return icons[piece] || 'help'
}

function handleSquareClick (row, col) {
  const piece = board.value[row][col]
  
  if (selectedSquare.value) {
    const move = possibleMoves.value.find(m => m.row === row && m.col === col)
    if (move) {
      board.value[row][col] = board.value[selectedSquare.value.row][selectedSquare.value.col]
      board.value[selectedSquare.value.row][selectedSquare.value.col] = null
      currentPlayer.value = currentPlayer.value === 'white' ? 'black' : 'white'
      selectedSquare.value = null
      possibleMoves.value = []
      return
    }
  }
  
  if (piece && piece.startsWith(currentPlayer.value[0])) {
    selectedSquare.value = { row, col }
    possibleMoves.value = getPossibleMoves(row, col, piece)
  } else {
    selectedSquare.value = null
    possibleMoves.value = []
  }
}

function getPossibleMoves (row, col, piece) {
  const moves = []
  if (piece === 'wp' || piece === 'bp') {
    const direction = piece.startsWith('w') ? -1 : 1
    if (!board.value[row + direction]?.[col]) {
      moves.push({ row: row + direction, col })
    }
  } else {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (r !== row || c !== col) {
          moves.push({ row: r, col: c })
        }
      }
    }
  }
  return moves.slice(0, 8)
}

function resetGame () {
  board.value = [
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
  ]
  currentPlayer.value = 'white'
  selectedSquare.value = null
  possibleMoves.value = []
}
</script>

<style scoped>
.game-container {
  width: 100%;
  max-width: 600px;
}

.chess-board {
  display: inline-block;
  border: 3px solid #8b4513;
  margin: 0 auto;
}

.chess-row {
  display: flex;
}

.chess-square {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.chess-square.light {
  background-color: #f0d9b5;
}

.chess-square.dark {
  background-color: #b58863;
}

.chess-square.selected {
  background-color: #ffd700 !important;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
}

.chess-square.possible-move {
  background-color: #90ee90 !important;
}

.chess-square:hover {
  opacity: 0.8;
}

@media (max-width: 600px) {
  .chess-square {
    width: 40px;
    height: 40px;
  }
}
</style>
