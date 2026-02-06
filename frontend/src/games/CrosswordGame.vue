<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Crossword</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Fill the crossword</div>
        </div>
        <div class="crossword-grid">
          <div v-for="(row, i) in grid" :key="i" class="crossword-row">
            <div
              v-for="(cell, j) in row"
              :key="j"
              :class="['crossword-cell', cell === null ? 'blocked' : '', selectedCell?.row === i && selectedCell?.col === j ? 'selected' : '']"
              @click="selectCell(i, j)"
            >
              {{ cell === null ? '' : cell }}
            </div>
          </div>
        </div>
        <div class="q-mt-md">
          <div class="text-caption q-mb-sm text-center">Select a cell, then choose a letter</div>
          <div class="letter-pad">
            <div class="letter-row">
              <q-btn
                v-for="letter in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')"
                :key="letter"
                unelevated
                color="primary"
                :label="letter"
                size="sm"
                class="letter-btn"
                @click="setLetter(letter)"
              />
            </div>
            <div class="letter-row q-mt-sm">
              <q-btn
                unelevated
                color="grey"
                label="Clear"
                size="sm"
                class="letter-btn clear-btn"
                @click="clearCell"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const grid = ref([
  ['', '', '', 'H', 'E', 'L', 'L', 'O', '', ''],
  ['', '', '', '', '', '', '', '', '', ''],
  ['W', 'O', 'R', 'L', 'D', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '']
])
const selectedCell = ref(null)

function selectCell (row, col) {
  if (grid.value[row][col] !== null) {
    selectedCell.value = { row, col }
  }
}

function setLetter (letter) {
  if (selectedCell.value) {
    const { row, col } = selectedCell.value
    grid.value[row][col] = letter
    selectedCell.value = null
  }
}

function clearCell () {
  if (selectedCell.value) {
    const { row, col } = selectedCell.value
    grid.value[row][col] = ''
    selectedCell.value = null
  }
}

function resetGame () {
  grid.value = [
    ['', '', '', 'H', 'E', 'L', 'L', 'O', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['W', 'O', 'R', 'L', 'D', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '']
  ]
  selectedCell.value = null
}
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
.crossword-grid { display: inline-block; }
.crossword-row { display: flex; }
.crossword-cell { width: 30px; height: 30px; text-align: center; border: 1px solid #333; cursor: pointer; display: flex; align-items: center; justify-content: center; background: #fff; }
.crossword-cell.blocked { background: #000; cursor: default; }
.crossword-cell.selected { background: #bbdefb; }
.letter-pad { display: flex; flex-direction: column; align-items: center; }
.letter-row { display: flex; flex-wrap: wrap; gap: 5px; justify-content: center; }
.letter-btn { min-width: 35px; min-height: 35px; touch-action: manipulation; }
.clear-btn { min-width: 100px; }
</style>
