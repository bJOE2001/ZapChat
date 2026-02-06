<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Dots & Boxes</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>

      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Player {{ currentPlayer }}'s Turn</div>
          <div class="text-caption text-grey-7">Click edges to draw lines</div>
        </div>

        <div class="dots-board">
          <div
            v-for="(row, rowIndex) in grid"
            :key="rowIndex"
            class="dots-row"
          >
            <div
              v-for="(cell, colIndex) in row"
              :key="colIndex"
              class="dots-cell"
            >
              <div class="dot" />
              <div
                v-if="colIndex < row.length - 1"
                :class="['edge-h', cell.right ? 'drawn' : '']"
                @click="drawEdge(rowIndex, colIndex, 'right')"
              />
              <div
                v-if="rowIndex < grid.length - 1"
                :class="['edge-v', cell.bottom ? 'drawn' : '']"
                @click="drawEdge(rowIndex, colIndex, 'bottom')"
              />
            </div>
          </div>
        </div>

        <div class="q-mt-md text-center">
          <q-badge color="primary">Player 1: {{ score1 }}</q-badge>
          <q-badge color="secondary" class="q-ml-sm">Player 2: {{ score2 }}</q-badge>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

const gridSize = 4
const grid = ref([])
const currentPlayer = ref(1)
const score1 = ref(0)
const score2 = ref(0)

function initGrid () {
  grid.value = []
  for (let i = 0; i < gridSize; i++) {
    grid.value[i] = []
    for (let j = 0; j < gridSize; j++) {
      grid.value[i][j] = {
        right: false,
        bottom: false,
        owner: null
      }
    }
  }
}

function drawEdge (row, col, direction) {
  if (grid.value[row][col][direction]) return
  
  grid.value[row][col][direction] = true
  
  const completed = checkCompletedBoxes(row, col, direction)
  if (completed === 0) {
    currentPlayer.value = currentPlayer.value === 1 ? 2 : 1
  } else {
    if (currentPlayer.value === 1) {
      score1.value += completed
    } else {
      score2.value += completed
    }
  }
}

function checkCompletedBoxes (row, col, direction) {
  let completed = 0
  
  if (direction === 'right' && row > 0) {
    if (grid.value[row - 1][col].bottom && grid.value[row - 1][col].right && grid.value[row][col].bottom) {
      completed++
    }
  }
  
  if (direction === 'bottom' && col > 0) {
    if (grid.value[row][col - 1].right && grid.value[row][col - 1].bottom && grid.value[row][col].right) {
      completed++
    }
  }
  
  return completed
}

function resetGame () {
  initGrid()
  currentPlayer.value = 1
  score1.value = 0
  score2.value = 0
}

initGrid()
</script>

<style scoped>
.game-container {
  width: 100%;
  max-width: 500px;
}

.dots-board {
  display: inline-block;
  margin: 0 auto;
}

.dots-row {
  display: flex;
}

.dots-cell {
  position: relative;
  width: 60px;
  height: 60px;
}

.dot {
  width: 8px;
  height: 8px;
  background-color: #333;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.edge-h {
  position: absolute;
  top: 50%;
  right: 0;
  width: 60px;
  height: 4px;
  cursor: pointer;
  background-color: transparent;
  transform: translateY(-50%);
}

.edge-h.drawn {
  background-color: #1976d2;
}

.edge-v {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 4px;
  height: 60px;
  cursor: pointer;
  background-color: transparent;
  transform: translateX(-50%);
}

.edge-v.drawn {
  background-color: #1976d2;
}

.edge-h:hover:not(.drawn) {
  background-color: rgba(25, 118, 210, 0.3);
}

.edge-v:hover:not(.drawn) {
  background-color: rgba(25, 118, 210, 0.3);
}

@media (max-width: 600px) {
  .dots-cell {
    width: 40px;
    height: 40px;
  }
  
  .edge-h {
    width: 40px;
  }
  
  .edge-v {
    height: 40px;
  }
}
</style>
