<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Jigsaw Puzzle</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Arrange the pieces</div>
        </div>
        <div class="jigsaw-grid">
          <div v-for="(row, i) in 3" :key="i" class="jigsaw-row">
            <div
              v-for="(col, j) in 3"
              :key="j"
              :class="['jigsaw-piece', pieces[i * 3 + j] === i * 3 + j ? 'correct' : '']"
              @click="movePiece(i * 3 + j)"
            >
              {{ pieces[i * 3 + j] + 1 }}
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const pieces = ref([0, 1, 2, 3, 4, 5, 6, 7, 8])

function movePiece (index) {
  const emptyIndex = pieces.value.indexOf(8)
  const row = Math.floor(index / 3)
  const col = index % 3
  const emptyRow = Math.floor(emptyIndex / 3)
  const emptyCol = emptyIndex % 3
  
  if ((Math.abs(row - emptyRow) === 1 && col === emptyCol) || 
      (row === emptyRow && Math.abs(col - emptyCol) === 1)) {
    [pieces.value[index], pieces.value[emptyIndex]] = [pieces.value[emptyIndex], pieces.value[index]]
  }
}

function resetGame () {
  pieces.value = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() - 0.5)
}
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
.jigsaw-grid { display: inline-block; border: 2px solid #333; }
.jigsaw-row { display: flex; }
.jigsaw-piece { width: 80px; height: 80px; border: 2px solid #333; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #fff; }
.jigsaw-piece.correct { background: #4CAF50; }
</style>
