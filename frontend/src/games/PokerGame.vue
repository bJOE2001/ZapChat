<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Poker</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Your Hand</div>
          <div class="q-mt-sm">
            <q-badge v-for="card in playerHand" :key="card" color="primary" class="q-mr-xs">
              {{ card }}
            </q-badge>
          </div>
        </div>
        <div class="text-center q-mt-md">
          <q-btn color="primary" label="Deal" @click="deal" :disable="gameOver" />
          <q-btn color="secondary" label="Fold" @click="fold" :disable="gameOver" class="q-ml-sm" />
        </div>
        <div v-if="gameOver" class="text-center q-mt-md">
          <div class="text-h6" :class="result === 'win' ? 'text-positive' : 'text-negative'">
            {{ result === 'win' ? 'You Win!' : 'You Lose!' }}
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const playerHand = ref([])
const gameOver = ref(false)
const result = ref('')

function deal () {
  playerHand.value = []
  for (let i = 0; i < 5; i++) {
    const suit = ['♠', '♥', '♦', '♣'][Math.floor(Math.random() * 4)]
    const value = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'][Math.floor(Math.random() * 13)]
    playerHand.value.push(value + suit)
  }
  gameOver.value = true
  result.value = Math.random() > 0.5 ? 'win' : 'lose'
}

function fold () {
  gameOver.value = true
  result.value = 'lose'
}

function resetGame () {
  playerHand.value = []
  gameOver.value = false
  result.value = ''
}
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
</style>
