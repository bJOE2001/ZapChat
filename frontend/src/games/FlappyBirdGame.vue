<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Flappy Bird</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>

      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Score: {{ score }}</div>
          <div class="text-caption text-grey-7">Tap screen to flap</div>
        </div>

        <div
          ref="gameCanvas"
          class="flappy-canvas"
          @click="flap"
          @touchstart.prevent="flap"
        >
          <div
            :style="{ bottom: birdY + 'px', left: '50px' }"
            class="bird"
          >
            🐦
          </div>
          <div
            v-for="(pipe, index) in pipes"
            :key="index"
            :style="{
              left: pipe.x + 'px',
              top: '0px',
              height: pipe.top + 'px'
            }"
            class="pipe pipe-top"
          />
          <div
            v-for="(pipe, index) in pipes"
            :key="'bottom-' + index"
            :style="{
              left: pipe.x + 'px',
              bottom: '0px',
              height: pipe.bottom + 'px'
            }"
            class="pipe pipe-bottom"
          />
        </div>

        <div v-if="gameOver" class="text-center q-mt-md">
          <div class="text-h6 text-negative">Game Over!</div>
          <q-btn color="primary" label="Play Again" @click="resetGame" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const gameCanvas = ref(null)
const birdY = ref(150)
const velocity = ref(0)
const score = ref(0)
const gameOver = ref(false)
const gameStarted = ref(false)
let gameLoop = null

const pipes = ref([])

function flap () {
  if (gameOver.value) return
  if (!gameStarted.value) {
    gameStarted.value = true
    startGame()
  }
  velocity.value = -8
}

function startGame () {
  gameLoop = setInterval(() => {
    if (gameOver.value) return
    
    velocity.value += 0.5
    birdY.value += velocity.value
    
    if (pipes.value.length === 0 || pipes.value[pipes.value.length - 1].x < 200) {
      pipes.value.push({
        x: 400,
        top: Math.random() * 150 + 50,
        bottom: Math.random() * 150 + 50
      })
    }
    
    pipes.value.forEach(pipe => {
      pipe.x -= 2
    })
    
    pipes.value = pipes.value.filter(pipe => pipe.x > -100)
    
    pipes.value.forEach(pipe => {
      if (pipe.x < 100 && pipe.x > 30) {
        if (birdY.value < pipe.top || birdY.value > 300 - pipe.bottom) {
          gameOver.value = true
          clearInterval(gameLoop)
        }
      }
      if (pipe.x === 50) {
        score.value++
      }
    })
    
    if (birdY.value < 0 || birdY.value > 300) {
      gameOver.value = true
      clearInterval(gameLoop)
    }
  }, 20)
}

function resetGame () {
  birdY.value = 150
  velocity.value = 0
  score.value = 0
  gameOver.value = false
  gameStarted.value = false
  pipes.value = []
  if (gameLoop) {
    clearInterval(gameLoop)
  }
}

onBeforeUnmount(() => {
  if (gameLoop) {
    clearInterval(gameLoop)
  }
})
</script>

<style scoped>
.game-container {
  width: 100%;
  max-width: 500px;
}

.flappy-canvas {
  width: 100%;
  height: 300px;
  background: linear-gradient(to bottom, #87CEEB 0%, #98D8C8 100%);
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
}

.bird {
  position: absolute;
  font-size: 30px;
  transition: transform 0.1s;
}

.pipe {
  position: absolute;
  width: 60px;
  background-color: #4caf50;
  border: 2px solid #2e7d32;
}

.pipe-top {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.pipe-bottom {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
</style>
