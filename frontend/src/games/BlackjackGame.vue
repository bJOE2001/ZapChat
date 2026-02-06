<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Blackjack</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Dealer: {{ dealerTotal }}</div>
          <div class="text-h6 q-mt-sm">You: {{ playerTotal }}</div>
        </div>
        <div class="q-mt-md text-center">
          <q-btn color="primary" label="Hit" @click="hit" :disable="gameOver" />
          <q-btn color="secondary" label="Stand" @click="stand" :disable="gameOver" class="q-ml-sm" />
        </div>
        <div v-if="gameOver" class="q-mt-md text-center">
          <div class="text-h6" :class="result === 'win' ? 'text-positive' : 'text-negative'">
            {{ result === 'win' ? 'You Win!' : result === 'lose' ? 'You Lose!' : 'Push!' }}
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

const playerCards = ref([])
const dealerCards = ref([])
const gameOver = ref(false)
const result = ref('')

const playerTotal = computed(() => playerCards.value.reduce((sum, card) => sum + card, 0))
const dealerTotal = computed(() => dealerCards.value.reduce((sum, card) => sum + card, 0))

function dealCard () {
  return Math.min(11, Math.floor(Math.random() * 11) + 1)
}

function hit () {
  playerCards.value.push(dealCard())
  if (playerTotal.value > 21) {
    gameOver.value = true
    result.value = 'lose'
  }
}

function stand () {
  while (dealerTotal.value < 17) {
    dealerCards.value.push(dealCard())
  }
  gameOver.value = true
  if (dealerTotal.value > 21 || playerTotal.value > dealerTotal.value) {
    result.value = 'win'
  } else if (playerTotal.value < dealerTotal.value) {
    result.value = 'lose'
  } else {
    result.value = 'push'
  }
}

function resetGame () {
  playerCards.value = [dealCard(), dealCard()]
  dealerCards.value = [dealCard()]
  gameOver.value = false
  result.value = ''
}

resetGame()
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
</style>
