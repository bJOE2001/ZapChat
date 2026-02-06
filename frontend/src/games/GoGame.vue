<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Go</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Player {{ currentPlayer === 'black' ? 'Black' : 'White' }}</div>
        </div>
        <div class="go-board">
          <div v-for="(row, i) in 9" :key="i" class="go-row">
            <div
              v-for="(col, j) in 9"
              :key="j"
              :class="['go-intersection', board[i][j]]"
              @click="placeStone(i, j)"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const board = ref([])
const currentPlayer = ref('black')

function initBoard () {
  board.value = Array(9).fill(null).map(() => Array(9).fill(null))
}

function placeStone (row, col) {
  if (board.value[row][col]) return
  board.value[row][col] = currentPlayer.value
  currentPlayer.value = currentPlayer.value === 'black' ? 'white' : 'black'
}

function resetGame () {
  initBoard()
  currentPlayer.value = 'black'
}

initBoard()
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
.go-board { display: inline-block; background: #DEB887; padding: 10px; border-radius: 8px; }
.go-row { display: flex; }
.go-intersection { width: 40px; height: 40px; border: 1px solid #8B4513; position: relative; cursor: pointer; }
.go-intersection.black::after { content: ''; position: absolute; width: 30px; height: 30px; background: #000; border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%); }
.go-intersection.white::after { content: ''; position: absolute; width: 30px; height: 30px; background: #fff; border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%); border: 2px solid #000; }
</style>
