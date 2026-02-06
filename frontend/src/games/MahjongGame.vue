<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Mahjong</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Match pairs of tiles</div>
        </div>
        <div class="mahjong-grid">
          <div
            v-for="(tile, i) in tiles"
            :key="i"
            :class="['mahjong-tile', tile.matched ? 'matched' : '', tile.selected ? 'selected' : '']"
            @click="selectTile(i)"
          >
            {{ tile.matched ? '' : tile.value }}
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const tiles = ref([])
const selected = ref(null)

function initTiles () {
  const values = ['1', '2', '3', '4', '5', '1', '2', '3', '4', '5', '1', '2']
  tiles.value = values.map(v => ({ value: v, matched: false, selected: false }))
}

function selectTile (index) {
  if (tiles.value[index].matched) return
  
  if (selected.value === null) {
    selected.value = index
    tiles.value[index].selected = true
  } else {
    if (selected.value === index) {
      tiles.value[index].selected = false
      selected.value = null
    } else {
      if (tiles.value[selected.value].value === tiles.value[index].value) {
        tiles.value[selected.value].matched = true
        tiles.value[index].matched = true
      }
      tiles.value[selected.value].selected = false
      selected.value = null
    }
  }
}

function resetGame () {
  initTiles()
  selected.value = null
}

initTiles()
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
.mahjong-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.mahjong-tile { width: 80px; height: 100px; border: 2px solid #333; display: flex; align-items: center; justify-content: center; background: #fff; cursor: pointer; }
.mahjong-tile.selected { border-color: #2196F3; background: #E3F2FD; }
.mahjong-tile.matched { opacity: 0.3; }
</style>
