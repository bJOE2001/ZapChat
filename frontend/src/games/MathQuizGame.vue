<template>
  <q-page class="math-quiz-page">
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/games')" />
      <q-toolbar-title class="text-weight-bold">Math Quiz</q-toolbar-title>
      <q-btn flat round dense icon="refresh" @click="newQuestion" />
    </q-toolbar>

    <div class="q-pa-md">
      <div class="row justify-center q-mb-md">
        <div class="text-h6">Score: {{ score }}</div>
        <q-space />
        <div class="text-h6">Correct: {{ correct }}/{{ total }}</div>
      </div>

      <div class="row justify-center">
        <q-card class="quiz-card">
          <q-card-section>
            <div class="text-h4 text-center q-mb-lg">{{ question }}</div>
            <q-input
              v-model.number="answer"
              type="number"
              label="Your Answer"
              outlined
              class="q-mb-md"
              @keyup.enter="checkAnswer"
            />
            <q-btn
              unelevated
              color="primary"
              label="Submit"
              class="full-width"
              :disable="answer === null"
              @click="checkAnswer"
            />
          </q-card-section>
        </q-card>
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

const question = ref('')
const answer = ref(null)
const correctAnswer = ref(0)
const score = ref(0)
const correct = ref(0)
const total = ref(0)
const feedback = ref('')
const feedbackClass = ref('')
const feedbackIcon = ref('')

function generateQuestion () {
  const num1 = Math.floor(Math.random() * 50) + 1
  const num2 = Math.floor(Math.random() * 50) + 1
  const ops = ['+', '-', '*']
  const op = ops[Math.floor(Math.random() * ops.length)]
  
  question.value = `${num1} ${op} ${num2} = ?`
  
  if (op === '+') correctAnswer.value = num1 + num2
  else if (op === '-') correctAnswer.value = num1 - num2
  else correctAnswer.value = num1 * num2
}

function checkAnswer () {
  if (answer.value === null) return
  
  total.value++
  if (answer.value === correctAnswer.value) {
    score.value += 10
    correct.value++
    feedback.value = 'Correct!'
    feedbackClass.value = 'bg-positive text-white'
    feedbackIcon.value = 'check_circle'
  } else {
    feedback.value = `Wrong! The answer is ${correctAnswer.value}`
    feedbackClass.value = 'bg-negative text-white'
    feedbackIcon.value = 'cancel'
  }
  
  answer.value = null
  setTimeout(() => {
    feedback.value = ''
    generateQuestion()
  }, 2000)
}

function newQuestion () {
  generateQuestion()
  answer.value = null
  feedback.value = ''
}

newQuestion()
</script>

<style scoped>
.math-quiz-page {
  background: #f5f5f5;
}

.quiz-card {
  min-width: 400px;
  max-width: 500px;
}
</style>
