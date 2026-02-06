<template>
  <q-page class="sudoku-game-page">
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/games')" />
      <q-toolbar-title class="text-weight-bold">Sudoku</q-toolbar-title>
      <q-btn flat round dense icon="refresh" @click="newGame" />
    </q-toolbar>

    <div class="q-pa-md">
      <div class="row justify-center q-mb-md">
        <div class="text-h6">Score: {{ score }}</div>
        <q-space />
        <q-btn
          outline
          color="primary"
          label="New Game"
          @click="newGame"
        />
      </div>

      <div class="row justify-center">
        <div class="sudoku-grid">
          <div
            v-for="(row, rowIdx) in grid"
            :key="rowIdx"
            class="sudoku-row"
          >
            <div
              v-for="(cell, colIdx) in row"
              :key="colIdx"
              class="sudoku-cell"
              :class="{
                'cell-prefilled': cell.prefilled,
                'cell-selected': selectedCell?.row === rowIdx && selectedCell?.col === colIdx,
                'cell-error': cell.error
              }"
              @click="selectCell(rowIdx, colIdx)"
            >
              <span class="cell-value">{{ cell.value || '' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="row justify-center q-mt-md">
        <div class="number-pad">
          <q-btn
            v-for="num in 9"
            :key="num"
            unelevated
            color="primary"
            :label="num"
            class="number-btn"
            @click="setCellValue(num)"
          />
          <q-btn
            unelevated
            color="grey"
            label="Clear"
            class="number-btn clear-btn"
            @click="clearCell"
          />
        </div>
      </div>

      <q-banner v-if="gameWon" class="bg-positive text-white q-mt-md">
        <template v-slot:avatar>
          <q-icon name="celebration" />
        </template>
        Congratulations! You solved the Sudoku puzzle!
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const grid = ref([])
const selectedCell = ref(null)
const score = ref(0)
const gameWon = ref(false)

function generateSudoku () {
  const size = 9
  const newGrid = []
  for (let i = 0; i < size; i++) {
    const row = []
    for (let j = 0; j < size; j++) {
      const prefilled = Math.random() < 0.4
      row.push({
        value: prefilled ? Math.floor(Math.random() * 9) + 1 : null,
        prefilled,
        error: false
      })
    }
    newGrid.push(row)
  }
  return newGrid
}

function selectCell (row, col) {
  if (!grid.value[row][col].prefilled) {
    selectedCell.value = { row, col }
  }
}

function setCellValue (value) {
  if (selectedCell.value) {
    const { row, col } = selectedCell.value
    if (!grid.value[row][col].prefilled) {
      grid.value[row][col].value = value
      checkWin()
    }
  }
}

function clearCell () {
  if (selectedCell.value) {
    const { row, col } = selectedCell.value
    if (!grid.value[row][col].prefilled) {
      grid.value[row][col].value = null
    }
  }
}

function checkWin () {
  let allFilled = true
  for (const row of grid.value) {
    for (const cell of row) {
      if (!cell.value) {
        allFilled = false
        break
      }
    }
    if (!allFilled) break
  }
  if (allFilled) {
    gameWon.value = true
    score.value += 100
  }
}

function newGame () {
  grid.value = generateSudoku()
  selectedCell.value = null
  gameWon.value = false
}

newGame()
</script>

<style scoped>
.sudoku-game-page {
  background: #f5f5f5;
}

.sudoku-grid {
  border: 3px solid #333;
  display: inline-block;
}

.sudoku-row {
  display: flex;
}

.sudoku-cell {
  width: 40px;
  height: 40px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
}

.sudoku-cell:nth-child(3n) {
  border-right: 2px solid #333;
}

.sudoku-row:nth-child(3n) .sudoku-cell {
  border-bottom: 2px solid #333;
}

.cell-prefilled {
  background: #e0e0e0;
  font-weight: bold;
  cursor: default;
}

.cell-selected {
  background: #bbdefb;
}

.cell-error {
  background: #ffcdd2;
}

.cell-value {
  font-weight: bold;
  font-size: 18px;
}

.clear-btn {
  width: 100%;
  margin-top: 8px;
}

.number-pad {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  max-width: 300px;
}

.number-btn {
  width: 50px;
  height: 50px;
  font-size: 20px;
  font-weight: bold;
}

@media (min-width: 600px) {
  .sudoku-cell {
    width: 50px;
    height: 50px;
    font-size: 22px;
  }
}
</style>
