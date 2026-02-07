<template>
  <q-page class="guessing-game-page">
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/games')" />
      <q-toolbar-title class="text-weight-bold">Number Guessing</q-toolbar-title>
      <q-btn flat round dense icon="refresh" @click="newGame" />
    </q-toolbar>

    <div class="q-pa-md">
      <div class="row justify-center q-mb-lg">
        <q-card class="game-card">
          <q-card-section>
            <div class="text-h5 text-center q-mb-md">Guess the Number!</div>
            <div class="text-body1 text-center q-mb-md">
              I'm thinking of a number between <strong>1</strong> and <strong>100</strong>
            </div>
            <div class="text-h6 text-center q-mb-md">
              Attempts: <strong>{{ attempts }}</strong>
            </div>
            <div v-if="hint" class="text-center q-mb-md" :class="hintClass">
              <q-icon :name="hintIcon" size="md" class="q-mr-sm" />
              {{ hint }}
            </div>
          </q-card-section>

          <q-card-section>
            <q-input
              v-model.number="guess"
              type="number"
              label="Your Guess"
              outlined
              :min="1"
              :max="100"
              :disable="gameWon || gameOver"
              class="q-mb-md"
              @keyup.enter="checkGuess"
            >
              <template v-slot:append>
                <q-btn
                  round
                  dense
                  flat
                  icon="send"
                  :disable="!guess || gameWon || gameOver"
                  @click="checkGuess"
                />
              </template>
            </q-input>

            <div v-if="previousGuesses.length > 0" class="q-mt-md">
              <div class="text-subtitle2 q-mb-sm">Previous Guesses:</div>
              <div class="row q-gutter-xs">
                <q-chip
                  v-for="(g, idx) in previousGuesses"
                  :key="idx"
                  :color="g.hint === 'correct' ? 'positive' : (g.hint === 'higher' ? 'info' : 'warning')"
                  text-color="white"
                  :label="`${g.value} (${g.hint})`"
                />
              </div>
            </div>
          </q-card-section>

          <q-card-actions v-if="gameWon || gameOver" align="center">
            <q-btn
              unelevated
              color="primary"
              label="Play Again"
              size="lg"
              @click="newGame"
            />
          </q-card-actions>
        </q-card>
      </div>

      <q-banner v-if="gameWon" class="bg-positive text-white">
        <template v-slot:avatar>
          <q-icon name="celebration" />
        </template>
        Congratulations! You guessed it in {{ attempts }} attempts!
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const targetNumber = ref(null)
const guess = ref(null)
const attempts = ref(0)
const previousGuesses = ref([])
const hint = ref('')
const hintClass = ref('')
const hintIcon = ref('')
const gameWon = ref(false)
const gameOver = ref(false)

function generateNumber () {
  return Math.floor(Math.random() * 100) + 1
}

function checkGuess () {
  if (!guess.value || guess.value < 1 || guess.value > 100) {
    return
  }

  attempts.value++
  const diff = guess.value - targetNumber.value

  if (diff === 0) {
    gameWon.value = true
    hint.value = 'Correct! You guessed it!'
    hintClass.value = 'text-positive'
    hintIcon.value = 'check_circle'
    previousGuesses.push({ value: guess.value, hint: 'correct' })
  } else if (diff > 0) {
    hint.value = 'Too high! Try a lower number.'
    hintClass.value = 'text-warning'
    hintIcon.value = 'arrow_downward'
    previousGuesses.push({ value: guess.value, hint: 'lower' })
  } else {
    hint.value = 'Too low! Try a higher number.'
    hintClass.value = 'text-info'
    hintIcon.value = 'arrow_upward'
    previousGuesses.push({ value: guess.value, hint: 'higher' })
  }

  if (attempts.value >= 10 && !gameWon.value) {
    gameOver.value = true
    hint.value = `Game Over! The number was ${targetNumber.value}`
    hintClass.value = 'text-negative'
    hintIcon.value = 'cancel'
  }

  guess.value = null
}

function newGame () {
  targetNumber.value = generateNumber()
  guess.value = null
  attempts.value = 0
  previousGuesses.value = []
  hint.value = ''
  hintClass.value = ''
  hintIcon.value = ''
  gameWon.value = false
  gameOver.value = false
}

newGame()
</script>

<style scoped>
.guessing-game-page {
  background: #f5f5f5;
}

.game-card {
  max-width: 500px;
  width: 100%;
}
</style>
