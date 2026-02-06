<template>
  <q-page class="card-match-page">
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/games')" />
      <q-toolbar-title class="text-weight-bold">Card Match</q-toolbar-title>
      <q-btn flat round dense icon="refresh" @click="newGame" />
    </q-toolbar>

    <div class="q-pa-md">
      <div class="row justify-center q-mb-md">
        <div class="text-h6">Moves: {{ moves }}</div>
        <q-space />
        <div class="text-h6">Pairs: {{ pairsFound }}/{{ totalPairs }}</div>
      </div>

      <div class="row justify-center">
        <div class="card-grid">
          <div
            v-for="(card, index) in cards"
            :key="index"
            class="card"
            :class="{ 'flipped': card.flipped, 'matched': card.matched }"
            @click="flipCard(index)"
          >
            <div class="card-front">?</div>
            <div class="card-back">{{ card.symbol }}</div>
          </div>
        </div>
      </div>

      <q-banner v-if="gameWon" class="bg-positive text-white q-mt-md">
        <template v-slot:avatar>
          <q-icon name="celebration" />
        </template>
        You won in {{ moves }} moves!
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const symbols = ['❤️', '⭐', '🎮', '🚀', '🎯', '🎨', '🎵', '🎪']
const cards = ref([])
const flippedCards = ref([])
const moves = ref(0)
const pairsFound = ref(0)
const totalPairs = ref(8)
const gameWon = ref(false)

function generateCards () {
  const values = []
  for (let i = 0; i < totalPairs.value; i++) {
    values.push(symbols[i], symbols[i])
  }
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]]
  }
  return values.map(symbol => ({ symbol, flipped: false, matched: false }))
}

function flipCard (index) {
  if (cards.value[index].flipped || cards.value[index].matched || flippedCards.value.length >= 2) return
  
  cards.value[index].flipped = true
  flippedCards.value.push(index)
  
  if (flippedCards.value.length === 2) {
    moves.value++
    const [first, second] = flippedCards.value
    if (cards.value[first].symbol === cards.value[second].symbol) {
      cards.value[first].matched = true
      cards.value[second].matched = true
      pairsFound.value++
      flippedCards.value = []
      if (pairsFound.value === totalPairs.value) {
        gameWon.value = true
      }
    } else {
      setTimeout(() => {
        cards.value[first].flipped = false
        cards.value[second].flipped = false
        flippedCards.value = []
      }, 1000)
    }
  }
}

function newGame () {
  cards.value = generateCards()
  flippedCards.value = []
  moves.value = 0
  pairsFound.value = 0
  gameWon.value = false
}

newGame()
</script>

<style scoped>
.card-match-page {
  background: #f5f5f5;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  max-width: 500px;
}

.card {
  aspect-ratio: 1;
  position: relative;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card.flipped {
  transform: rotateY(180deg);
}

.card.matched {
  opacity: 0.5;
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  border-radius: 8px;
  border: 2px solid #333;
}

.card-front {
  background: #2196f3;
  color: white;
}

.card-back {
  background: white;
  transform: rotateY(180deg);
}
</style>
