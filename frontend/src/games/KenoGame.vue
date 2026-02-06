<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Keno</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Selected: {{ selected.length }}/10</div>
          <div class="text-h6 q-mt-sm">Matches: {{ matches }}</div>
        </div>
        <div class="keno-grid">
          <div
            v-for="n in 80"
            :key="n"
            :class="['keno-number', selected.includes(n) ? 'selected' : '', drawn.includes(n) ? 'drawn' : '']"
            @click="toggleNumber(n)"
          >
            {{ n }}
          </div>
        </div>
        <div class="text-center q-mt-md">
          <q-btn color="primary" label="Draw Numbers" @click="draw" :disable="selected.length !== 10 || gameOver" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const selected = ref([])
const drawn = ref([])
const matches = ref(0)
const gameOver = ref(false)

function toggleNumber (num) {
  if (gameOver.value) return
  const index = selected.value.indexOf(num)
  if (index > -1) {
    selected.value.splice(index, 1)
  } else if (selected.value.length < 10) {
    selected.value.push(num)
  }
}

function draw () {
  drawn.value = []
  for (let i = 0; i < 20; i++) {
    let num
    do {
      num = Math.floor(Math.random() * 80) + 1
    } while (drawn.value.includes(num))
    drawn.value.push(num)
  }
  matches.value = selected.value.filter(n => drawn.value.includes(n)).length
  gameOver.value = true
}

function resetGame () {
  selected.value = []
  drawn.value = []
  matches.value = 0
  gameOver.value = false
}
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
.keno-grid { display: grid; grid-template-columns: repeat(10, 1fr); gap: 5px; }
.keno-number { width: 40px; height: 40px; border: 1px solid #333; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #fff; }
.keno-number.selected { background: #2196F3; color: #fff; }
.keno-number.drawn { background: #4CAF50; color: #fff; }
</style>
