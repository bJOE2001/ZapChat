<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Bingo</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Called: {{ called }}</div>
        </div>
        <div class="bingo-grid">
          <div v-for="n in 25" :key="n" :class="['bingo-cell', marked.includes(n) ? 'marked' : '']" @click="mark(n)">
            {{ n === 13 ? 'FREE' : n }}
          </div>
        </div>
        <div class="text-center q-mt-md">
          <q-btn color="primary" label="Call Number" @click="callNumber" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const called = ref(0)
const marked = ref([13])

function mark (num) {
  if (!marked.value.includes(num)) {
    marked.value.push(num)
  }
}

function callNumber () {
  called.value = Math.floor(Math.random() * 25) + 1
  if (!marked.value.includes(called.value)) {
    marked.value.push(called.value)
  }
}

function resetGame () {
  called.value = 0
  marked.value = [13]
}
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
.bingo-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; width: 300px; margin: 0 auto; }
.bingo-cell { width: 50px; height: 50px; border: 2px solid #333; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #fff; }
.bingo-cell.marked { background: #4CAF50; color: #fff; }
</style>
