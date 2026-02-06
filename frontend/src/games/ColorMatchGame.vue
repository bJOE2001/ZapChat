<template>
  <q-page class="color-match-page">
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/games')" />
      <q-toolbar-title class="text-weight-bold">Color Match</q-toolbar-title>
      <q-btn flat round dense icon="refresh" @click="newGame" />
    </q-toolbar>

    <div class="q-pa-md">
      <div class="row justify-center q-mb-md">
        <div class="text-h6">Score: {{ score }}</div>
        <q-space />
        <div class="text-h6">Level: {{ level }}</div>
      </div>

      <div class="row justify-center q-mb-md">
        <div class="target-color" :style="{ background: targetColor }"></div>
        <div class="text-h6 q-ml-md">Match this color!</div>
      </div>

      <div class="row justify-center">
        <div class="color-grid">
          <div
            v-for="(color, index) in colors"
            :key="index"
            class="color-cell"
            :style="{ background: color }"
            :class="{ 'correct': selectedIndex === index && isCorrect }"
            @click="selectColor(index)"
          >
            <q-icon v-if="selectedIndex === index && isCorrect" name="check" size="xl" color="white" />
            <q-icon v-if="selectedIndex === index && !isCorrect" name="close" size="xl" color="white" />
          </div>
        </div>
      </div>

      <q-banner v-if="feedback" class="q-mt-md" :class="feedbackClass">
        <template v-slot:avatar>
          <q-icon :name="feedbackIcon" />
        </template>
        {{ feedback }}
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const colors = ref([])
const targetColor = ref('')
const selectedIndex = ref(null)
const isCorrect = ref(false)
const score = ref(0)
const level = ref(1)
const feedback = ref('')
const feedbackClass = ref('')
const feedbackIcon = ref('')

function generateColors () {
  const colorCount = 3 + level.value
  const newColors = []
  const targetIdx = Math.floor(Math.random() * colorCount)
  
  for (let i = 0; i < colorCount; i++) {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    const color = `rgb(${r}, ${g}, ${b})`
    newColors.push(color)
    
    if (i === targetIdx) {
      targetColor.value = color
    }
  }
  
  colors.value = newColors
}

function selectColor (index) {
  selectedIndex.value = index
  isCorrect.value = index === colors.value.indexOf(targetColor.value)
  
  if (isCorrect.value) {
    score.value += 10 * level.value
    level.value++
    feedback.value = 'Correct!'
    feedbackClass.value = 'bg-positive text-white'
    feedbackIcon.value = 'check_circle'
    setTimeout(() => {
      feedback.value = ''
      generateColors()
      selectedIndex.value = null
    }, 1000)
  } else {
    feedback.value = 'Wrong! Try again.'
    feedbackClass.value = 'bg-negative text-white'
    feedbackIcon.value = 'cancel'
    setTimeout(() => {
      feedback.value = ''
      selectedIndex.value = null
    }, 1000)
  }
}

function newGame () {
  score.value = 0
  level.value = 1
  generateColors()
  selectedIndex.value = null
  feedback.value = ''
}

newGame()
</script>

<style scoped>
.color-match-page {
  background: #f5f5f5;
}

.target-color {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  border: 3px solid #333;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 500px;
}

.color-cell {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  border: 3px solid #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.color-cell:hover {
  transform: scale(1.1);
}

.color-cell.correct {
  border-color: #4caf50;
  border-width: 5px;
}
</style>
