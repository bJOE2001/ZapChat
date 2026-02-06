<template>
  <q-page class="rps-page">
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/games')" />
      <q-toolbar-title class="text-weight-bold">Rock Paper Scissors</q-toolbar-title>
      <q-btn flat round dense icon="refresh" @click="resetScore" />
    </q-toolbar>

    <div class="q-pa-md">
      <div class="row justify-center q-mb-md">
        <div class="text-h6">Wins: {{ wins }}</div>
        <q-space />
        <div class="text-h6">Losses: {{ losses }}</div>
        <q-space />
        <div class="text-h6">Draws: {{ draws }}</div>
      </div>

      <div class="row justify-center q-mb-lg">
        <q-card class="choice-card">
          <q-card-section class="text-center">
            <div class="text-h6 q-mb-md">Choose Your Move</div>
            <div class="row q-gutter-md justify-center">
              <q-btn
                v-for="choice in choices"
                :key="choice"
                round
                size="xl"
                :icon="choiceIcons[choice]"
                :color="selectedChoice === choice ? 'primary' : 'grey'"
                @click="play(choice)"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div v-if="result" class="row justify-center">
        <q-card class="result-card">
          <q-card-section>
            <div class="text-center">
              <div class="text-h6 q-mb-md">You chose: {{ selectedChoice }}</div>
              <div class="text-h6 q-mb-md">AI chose: {{ aiChoice }}</div>
              <div class="text-h4" :class="resultClass">{{ result }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

const choices = ['rock', 'paper', 'scissors']
const choiceIcons = {
  rock: 'pan_tool',
  paper: 'description',
  scissors: 'content_cut'
}
const selectedChoice = ref(null)
const aiChoice = ref(null)
const result = ref('')
const wins = ref(0)
const losses = ref(0)
const draws = ref(0)

const resultClass = computed(() => {
  if (result.value === 'You Win!') return 'text-positive'
  if (result.value === 'You Lose!') return 'text-negative'
  return 'text-grey'
})

function play (choice) {
  selectedChoice.value = choice
  aiChoice.value = choices[Math.floor(Math.random() * choices.length)]
  
  if (choice === aiChoice.value) {
    result.value = 'Draw!'
    draws.value++
  } else if (
    (choice === 'rock' && aiChoice.value === 'scissors') ||
    (choice === 'paper' && aiChoice.value === 'rock') ||
    (choice === 'scissors' && aiChoice.value === 'paper')
  ) {
    result.value = 'You Win!'
    wins.value++
  } else {
    result.value = 'You Lose!'
    losses.value++
  }
}

function resetScore () {
  wins.value = 0
  losses.value = 0
  draws.value = 0
  result.value = ''
  selectedChoice.value = null
  aiChoice.value = null
}
</script>

<style scoped>
.rps-page {
  background: #f5f5f5;
}

.choice-card {
  min-width: 300px;
}

.result-card {
  min-width: 300px;
}
</style>
