<template>
  <q-page class="reaction-page">
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/games')" />
      <q-toolbar-title class="text-weight-bold">Reaction Time</q-toolbar-title>
      <q-btn flat round dense icon="refresh" @click="reset" />
    </q-toolbar>

    <div class="q-pa-md">
      <div class="row justify-center q-mb-md">
        <div class="text-h6">Average: {{ averageTime }}ms</div>
        <q-space />
        <div class="text-h6">Best: {{ bestTime }}ms</div>
      </div>

      <div class="row justify-center">
        <q-card class="reaction-card">
          <q-card-section class="text-center">
            <div
              class="reaction-box"
              :class="{ 'waiting': waiting, 'ready': ready, 'click': clickNow }"
              @click="handleClick"
            >
              <div v-if="waiting" class="text-h4">Wait...</div>
              <div v-else-if="ready" class="text-h4">Click Now!</div>
              <div v-else class="text-h4">{{ currentTime }}ms</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="row justify-center q-mt-md">
        <q-btn
          unelevated
          color="primary"
          label="Start New Round"
          :disable="waiting"
          @click="startRound"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

const waiting = ref(false)
const ready = ref(false)
const clickNow = ref(false)
const startTime = ref(0)
const currentTime = ref(0)
const times = ref([])
const bestTime = ref(parseInt(localStorage.getItem('reactionBest') || '999999'))

const averageTime = computed(() => {
  if (times.value.length === 0) return 0
  return Math.round(times.value.reduce((a, b) => a + b, 0) / times.value.length)
})

function startRound () {
  waiting.value = true
  ready.value = false
  clickNow.value = false
  
  setTimeout(() => {
    waiting.value = false
    ready.value = true
    startTime.value = Date.now()
  }, Math.random() * 3000 + 1000)
}

function handleClick () {
  if (waiting.value) {
    currentTime.value = 0
    clickNow.value = true
    setTimeout(() => {
      clickNow.value = false
      startRound()
    }, 1000)
    return
  }
  
  if (ready.value) {
    const time = Date.now() - startTime.value
    currentTime.value = time
    times.value.push(time)
    if (time < bestTime.value) {
      bestTime.value = time
      localStorage.setItem('reactionBest', time.toString())
    }
    ready.value = false
    clickNow.value = true
    setTimeout(() => {
      clickNow.value = false
    }, 2000)
  }
}

function reset () {
  times.value = []
  currentTime.value = 0
  waiting.value = false
  ready.value = false
  clickNow.value = false
}
</script>

<style scoped>
.reaction-page {
  background: #f5f5f5;
}

.reaction-card {
  min-width: 400px;
}

.reaction-box {
  width: 300px;
  height: 300px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.reaction-box.waiting {
  background: #ff9800;
}

.reaction-box.ready {
  background: #4caf50;
}

.reaction-box.click {
  background: #2196f3;
}
</style>
