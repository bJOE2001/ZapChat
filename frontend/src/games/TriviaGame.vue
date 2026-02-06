<template>
  <q-page class="trivia-page">
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/games')" />
      <q-toolbar-title class="text-weight-bold">Trivia Quiz</q-toolbar-title>
      <q-btn flat round dense icon="refresh" @click="newQuestion" />
    </q-toolbar>

    <div class="q-pa-md">
      <div class="row justify-center q-mb-md">
        <div class="text-h6">Score: {{ score }}</div>
        <q-space />
        <div class="text-h6">Correct: {{ correct }}/{{ total }}</div>
      </div>

      <div class="row justify-center">
        <q-card class="trivia-card">
          <q-card-section>
            <div class="text-h6 q-mb-md">{{ currentQuestion.question }}</div>
            <q-list>
              <q-item
                v-for="(option, index) in currentQuestion.options"
                :key="index"
                clickable
                :class="{ 'bg-positive': selectedAnswer === index && isCorrect, 'bg-negative': selectedAnswer === index && !isCorrect && answered }"
                @click="selectAnswer(index)"
              >
                <q-item-section>{{ option }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const questions = [
  { question: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], correct: 2 },
  { question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correct: 1 },
  { question: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correct: 1 },
  { question: 'Who wrote Romeo and Juliet?', options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'], correct: 1 },
  { question: 'What is the largest ocean?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correct: 3 }
]

const currentQuestion = ref(questions[0])
const selectedAnswer = ref(null)
const answered = ref(false)
const isCorrect = ref(false)
const score = ref(0)
const correct = ref(0)
const total = ref(0)

function selectAnswer (index) {
  if (answered.value) return
  
  selectedAnswer.value = index
  answered.value = true
  total.value++
  
  if (index === currentQuestion.value.correct) {
    isCorrect.value = true
    score.value += 10
    correct.value++
  } else {
    isCorrect.value = false
  }
  
  setTimeout(() => {
    newQuestion()
  }, 2000)
}

function newQuestion () {
  currentQuestion.value = questions[Math.floor(Math.random() * questions.length)]
  selectedAnswer.value = null
  answered.value = false
  isCorrect.value = false
}

newQuestion()
</script>

<style scoped>
.trivia-page {
  background: #f5f5f5;
}

.trivia-card {
  min-width: 400px;
  max-width: 600px;
}
</style>
