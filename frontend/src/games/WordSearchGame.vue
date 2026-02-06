<template>
  <q-page class="word-search-page">
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/games')" />
      <q-toolbar-title class="text-weight-bold">Word Search</q-toolbar-title>
      <q-btn flat round dense icon="refresh" @click="newGame" />
    </q-toolbar>

    <div class="q-pa-md">
      <div class="row justify-center q-mb-md">
        <div class="text-h6">Words Found: {{ foundWords.length }}/{{ words.length }}</div>
      </div>

      <div class="row justify-center q-mb-md">
        <div class="words-list">
          <q-chip
            v-for="word in words"
            :key="word"
            :color="foundWords.includes(word) ? 'positive' : 'grey'"
            :label="word"
            text-color="white"
          />
        </div>
      </div>

      <div class="row justify-center">
        <div class="word-grid">
          <div
            v-for="(row, rowIdx) in grid"
            :key="rowIdx"
            class="grid-row"
          >
            <div
              v-for="(cell, colIdx) in row"
              :key="colIdx"
              class="grid-cell"
              :class="{ 'selected': isSelected(rowIdx, colIdx), 'found': isFound(rowIdx, colIdx) }"
              @mousedown="startSelection(rowIdx, colIdx)"
              @mouseenter="continueSelection(rowIdx, colIdx)"
              @mouseup="endSelection"
            >
              {{ cell }}
            </div>
          </div>
        </div>
      </div>

      <q-banner v-if="foundWords.length === words.length" class="bg-positive text-white q-mt-md">
        <template v-slot:avatar>
          <q-icon name="celebration" />
        </template>
        All words found!
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const SIZE = 10
const words = ['HELLO', 'WORLD', 'GAME', 'FUN', 'PLAY']
const grid = ref([])
const foundWords = ref([])
const selectedCells = ref([])
const selecting = ref(false)

function generateGrid () {
  grid.value = Array(SIZE).fill(null).map(() =>
    Array(SIZE).fill(null).map(() =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    )
  )
  
  const word = words[0]
  const row = Math.floor(Math.random() * SIZE)
  const col = Math.floor(Math.random() * (SIZE - word.length))
  for (let i = 0; i < word.length; i++) {
    grid.value[row][col + i] = word[i]
  }
}

function startSelection (row, col) {
  selecting.value = true
  selectedCells.value = [{ row, col }]
}

function continueSelection (row, col) {
  if (!selecting.value) return
  if (!selectedCells.value.some(c => c.row === row && c.col === col)) {
    selectedCells.value.push({ row, col })
  }
}

function endSelection () {
  if (selectedCells.value.length > 0) {
    const selectedWord = selectedCells.value.map(c => grid.value[c.row][c.col]).join('')
    const reversedWord = selectedWord.split('').reverse().join('')
    
    if (words.includes(selectedWord) || words.includes(reversedWord)) {
      const word = words.includes(selectedWord) ? selectedWord : reversedWord
      if (!foundWords.value.includes(word)) {
        foundWords.value.push(word)
      }
    }
  }
  selecting.value = false
  selectedCells.value = []
}

function isSelected (row, col) {
  return selectedCells.value.some(c => c.row === row && c.col === col)
}

function isFound (row, col) {
  return false
}

function newGame () {
  foundWords.value = []
  selectedCells.value = []
  selecting.value = false
  generateGrid()
}

newGame()
</script>

<style scoped>
.word-search-page {
  background: #f5f5f5;
}

.words-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.word-grid {
  border: 2px solid #333;
  display: inline-block;
}

.grid-row {
  display: flex;
}

.grid-cell {
  width: 35px;
  height: 35px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bold;
}

.grid-cell.selected {
  background: #bbdefb;
}

.grid-cell.found {
  background: #c8e6c9;
}
</style>
