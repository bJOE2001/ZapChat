<template>
  <q-page class="hangman-page">
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/games')" />
      <q-toolbar-title class="text-weight-bold">Hangman</q-toolbar-title>
      <q-btn flat round dense icon="refresh" @click="newGame" />
    </q-toolbar>

    <div class="q-pa-md">
      <div class="row justify-center q-mb-md">
        <div class="text-h6">Wrong Guesses: {{ wrongGuesses }}/6</div>
        <q-space />
        <div class="text-h6">Wins: {{ wins }}</div>
      </div>

      <div class="row justify-center q-mb-md">
        <div class="hangman-display">
          <div class="text-h3">{{ displayWord }}</div>
        </div>
      </div>

      <div class="row justify-center q-mb-md">
        <div class="alphabet">
          <q-btn
            v-for="letter in alphabet"
            :key="letter"
            :disable="guessedLetters.includes(letter) || gameOver"
            :color="guessedLetters.includes(letter) ? 'grey' : 'primary'"
            :label="letter"
            class="letter-btn"
            @click="guessLetter(letter)"
          />
        </div>
      </div>

      <q-banner v-if="gameWon" class="bg-positive text-white">
        <template v-slot:avatar>
          <q-icon name="celebration" />
        </template>
        You Win! The word was "{{ word }}"
      </q-banner>

      <q-banner v-if="gameLost" class="bg-negative text-white">
        <template v-slot:avatar>
          <q-icon name="mood_bad" />
        </template>
        Game Over! The word was "{{ word }}"
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

const words = ['JAVASCRIPT', 'QUASAR', 'VUE', 'COMPUTER', 'PROGRAMMING', 'ALGORITHM', 'DEVELOPER', 'FRAMEWORK']
const word = ref('')
const guessedLetters = ref([])
const wrongGuesses = ref(0)
const gameWon = ref(false)
const gameLost = ref(false)
const gameOver = computed(() => gameWon.value || gameLost.value)
const wins = ref(0)

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const displayWord = computed(() => {
  return word.value.split('').map(letter => 
    guessedLetters.value.includes(letter) ? letter : '_'
  ).join(' ')
})

function guessLetter (letter) {
  if (guessedLetters.value.includes(letter) || gameOver.value) return
  
  guessedLetters.value.push(letter)
  
  if (!word.value.includes(letter)) {
    wrongGuesses.value++
    if (wrongGuesses.value >= 6) {
      gameLost.value = true
    }
  } else {
    if (displayWord.value.replace(/\s/g, '') === word.value) {
      gameWon.value = true
      wins.value++
    }
  }
}

function newGame () {
  word.value = words[Math.floor(Math.random() * words.length)]
  guessedLetters.value = []
  wrongGuesses.value = 0
  gameWon.value = false
  gameLost.value = false
}

newGame()
</script>

<style scoped>
.hangman-page {
  background: #f5f5f5;
}

.hangman-display {
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 8px;
  min-width: 300px;
  letter-spacing: 8px;
}

.alphabet {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 600px;
  justify-content: center;
}

.letter-btn {
  min-width: 40px;
}
</style>
