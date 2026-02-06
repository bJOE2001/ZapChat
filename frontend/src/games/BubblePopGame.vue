<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Bubble Pop</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Score: {{ score }}</div>
        </div>
        <div class="bubble-area">
          <div
            v-for="(bubble, i) in bubbles"
            :key="i"
            :class="['bubble', `color-${bubble.color}`]"
            :style="{ left: bubble.x + 'px', top: bubble.y + 'px' }"
            @click="pop(i)"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const bubbles = ref([])
const score = ref(0)

function createBubbles () {
  bubbles.value = Array(20).fill(null).map(() => ({
    x: Math.random() * 350,
    y: Math.random() * 300,
    color: Math.floor(Math.random() * 5)
  }))
}

function pop (index) {
  bubbles.value.splice(index, 1)
  score.value += 5
  if (bubbles.value.length === 0) {
    createBubbles()
  }
}

function resetGame () {
  score.value = 0
  createBubbles()
}

onMounted(() => {
  createBubbles()
})
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
.bubble-area { width: 400px; height: 300px; border: 2px solid #333; position: relative; margin: 0 auto; background: #87CEEB; }
.bubble { width: 40px; height: 40px; border-radius: 50%; position: absolute; cursor: pointer; border: 2px solid #fff; }
.color-0 { background: #f44336; }
.color-1 { background: #2196F3; }
.color-2 { background: #4CAF50; }
.color-3 { background: #FF9800; }
.color-4 { background: #9C27B0; }
</style>
