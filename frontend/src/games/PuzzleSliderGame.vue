<template>
  <q-page class="puzzle-page">
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/games')" />
      <q-toolbar-title class="text-weight-bold">Puzzle Slider</q-toolbar-title>
      <q-btn flat round dense icon="refresh" @click="shuffle" />
    </q-toolbar>

    <div class="q-pa-md">
      <div class="row justify-center q-mb-md">
        <div class="text-h6">Moves: {{ moves }}</div>
      </div>

      <div class="row justify-center">
        <div class="puzzle-grid">
          <div
            v-for="(tile, index) in tiles"
            :key="index"
            class="puzzle-tile"
            :class="{ 'empty': tile === 0, 'solved': isSolved }"
            @click="moveTile(index)"
          >
            {{ tile || '' }}
          </div>
        </div>
      </div>

      <q-banner v-if="isSolved" class="bg-positive text-white q-mt-md">
        <template v-slot:avatar>
          <q-icon name="celebration" />
        </template>
        Puzzle Solved in {{ moves }} moves!
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

const size = 4
const tiles = ref([])
const emptyIndex = ref(15)
const moves = ref(0)

const isSolved = computed(() => {
  for (let i = 0; i < tiles.value.length - 1; i++) {
    if (tiles.value[i] !== i + 1) return false
  }
  return tiles.value[tiles.value.length - 1] === 0
})

function initTiles () {
  tiles.value = []
  for (let i = 1; i < size * size; i++) {
    tiles.value.push(i)
  }
  tiles.value.push(0)
  emptyIndex.value = size * size - 1
}

function shuffle () {
  initTiles()
  moves.value = 0
  for (let i = 0; i < 1000; i++) {
    const neighbors = getNeighbors(emptyIndex.value)
    if (neighbors.length > 0) {
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)]
      swapTiles(randomNeighbor, emptyIndex.value)
      emptyIndex.value = randomNeighbor
    }
  }
  moves.value = 0
}

function getNeighbors (index) {
  const neighbors = []
  const row = Math.floor(index / size)
  const col = index % size
  
  if (row > 0) neighbors.push(index - size)
  if (row < size - 1) neighbors.push(index + size)
  if (col > 0) neighbors.push(index - 1)
  if (col < size - 1) neighbors.push(index + 1)
  
  return neighbors
}

function moveTile (index) {
  if (isSolved.value) return
  
  const neighbors = getNeighbors(emptyIndex.value)
  if (neighbors.includes(index)) {
    swapTiles(index, emptyIndex.value)
    emptyIndex.value = index
    moves.value++
  }
}

function swapTiles (i1, i2) {
  [tiles.value[i1], tiles.value[i2]] = [tiles.value[i2], tiles.value[i1]]
}

shuffle()
</script>

<style scoped>
.puzzle-page {
  background: #f5f5f5;
}

.puzzle-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  background: #333;
  padding: 4px;
  border-radius: 8px;
  max-width: 400px;
}

.puzzle-tile {
  width: 90px;
  height: 90px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
}

.puzzle-tile.empty {
  background: transparent;
  cursor: default;
}

.puzzle-tile.solved {
  background: #c8e6c9;
}
</style>
