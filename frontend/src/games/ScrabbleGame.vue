<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Scrabble</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Score: {{ score }}</div>
          <div class="text-caption">Place letters on the board</div>
        </div>
        <div class="scrabble-board">
          <div v-for="(row, i) in 15" :key="i" class="scrabble-row">
            <div
              v-for="(col, j) in 15"
              :key="j"
              :class="['scrabble-cell', selectedCell?.row === i && selectedCell?.col === j ? 'selected' : '']"
              @click="selectCell(i, j)"
            >
              {{ board[i][j] }}
            </div>
          </div>
        </div>
        <div class="q-mt-md">
          <div class="text-caption q-mb-sm text-center">Select a cell, then choose a letter</div>
          <div class="letter-pad-scrabble">
            <div class="letter-row">
              <q-btn
                v-for="letter in letters"
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

const board = ref(Array(15).fill(null).map(() => Array(15).fill('')))
const score = ref(0)
const letters = ref(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
const selectedCell = ref(null)

function selectCell (row, col) {
  selectedCell.value = { row, col }
}

function setLetter (letter) {
  if (selectedCell.value) {
    const { row, col } = selectedCell.value
    board.value[row][col] = letter
    const letterIndex = letters.value.indexOf(letter)
    if (letterIndex > -1) {
      letters.value.splice(letterIndex, 1)
    }
    selectedCell.value = null
  }
}

function clearCell () {
  if (selectedCell.value) {
    const { row, col } = selectedCell.value
    if (board.value[row][col]) {
      letters.value.push(board.value[row][col])
    }
    board.value[row][col] = ''
    selectedCell.value = null
  }
}

function resetGame () {
  board.value = Array(15).fill(null).map(() => Array(15).fill(''))
  score.value = 0
  letters.value = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  selectedCell.value = null
}
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
.scrabble-board { display: inline-block; border: 2px solid #333; }
.scrabble-row { display: flex; }
.scrabble-cell { width: 25px; height: 25px; text-align: center; border: 1px solid #ccc; cursor: pointer; display: flex; align-items: center; justify-content: center; background: #fff; }
.scrabble-cell.selected { background: #bbdefb; }
.letter-pad-scrabble { display: flex; flex-direction: column; align-items: center; }
.letter-row { display: flex; flex-wrap: wrap; gap: 5px; justify-content: center; }
.letter-btn { min-width: 35px; min-height: 35px; touch-action: manipulation; }
.clear-btn { min-width: 100px; }
</style>
