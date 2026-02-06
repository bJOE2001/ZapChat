<template>
  <q-page class="typing-page">
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/games')" />
      <q-toolbar-title class="text-weight-bold">Typing Speed Test</q-toolbar-title>
      <q-btn flat round dense icon="refresh" @click="newTest" />
    </q-toolbar>

    <div class="q-pa-md">
      <div class="row justify-center q-mb-md">
        <div class="text-h6">WPM: {{ wpm }}</div>
        <q-space />
        <div class="text-h6">Accuracy: {{ accuracy }}%</div>
        <q-space />
        <div class="text-h6">Time: {{ timeLeft }}s</div>
      </div>

      <div class="row justify-center">
        <q-card class="typing-card">
          <q-card-section>
            <div class="text-body1 q-mb-md typing-text">
              <span
                v-for="(char, index) in text"
                :key="index"
                :class="getCharClass(index)"
              >{{ char }}</span>
            </div>
            <q-input
              v-model="input"
              outlined
              placeholder="Start typing..."
              :disable="timeLeft <= 0"
              @input="onInput"
            />
          </q-card-section>
        </q-card>
      </div>

      <q-banner v-if="timeLeft <= 0" class="bg-info text-white q-mt-md">
        <template v-slot:avatar>
          <q-icon name="info" />
        </template>
        Test Complete! Your speed: {{ wpm }} WPM, Accuracy: {{ accuracy }}%
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const text = ref('The quick brown fox jumps over the lazy dog')
const input = ref('')
const timeLeft = ref(60)
const correctChars = ref(0)
const totalChars = ref(0)
let timer = null

const wpm = ref(0)
const accuracy = ref(100)

function getCharClass (index) {
  if (index >= input.value.length) return ''
  if (input.value[index] === text.value[index]) return 'text-positive'
  return 'text-negative'
}

function onInput () {
  totalChars.value++
  if (input.value[input.value.length - 1] === text.value[input.value.length - 1]) {
    correctChars.value++
  }
  
  const wordsTyped = input.value.split(' ').length
  wpm.value = Math.round((wordsTyped / (60 - timeLeft.value)) * 60)
  accuracy.value = totalChars.value > 0 ? Math.round((correctChars.value / totalChars.value) * 100) : 100
  
  if (input.value === text.value) {
    newTest()
  }
}

function newTest () {
  input.value = ''
  timeLeft.value = 60
  correctChars.value = 0
  totalChars.value = 0
  wpm.value = 0
  accuracy.value = 100
  const texts = [
    'The quick brown fox jumps over the lazy dog',
    'Programming is the art of telling a computer what to do',
    'Practice makes perfect when learning to type faster',
    'JavaScript is a versatile programming language for web development'
  ]
  text.value = texts[Math.floor(Math.random() * texts.length)]
}

onMounted(() => {
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    }
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.typing-page {
  background: #f5f5f5;
}

.typing-card {
  min-width: 600px;
  max-width: 800px;
}

.typing-text {
  font-family: monospace;
  font-size: 18px;
  line-height: 1.8;
  min-height: 100px;
}
</style>
