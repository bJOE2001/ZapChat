<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="game-container">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn flat round icon="arrow_back" @click="$router.push('/games')" />
          <q-space />
          <div class="text-h5 text-weight-bold">Solitaire</div>
          <q-space />
          <q-btn flat round icon="refresh" @click="resetGame" />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <div class="text-h6">Move cards to build stacks</div>
        </div>
        <div class="solitaire-area">
          <div class="foundation-piles">
            <div v-for="i in 4" :key="i" class="foundation-pile">
              <div v-if="foundations[i - 1].length > 0" class="card">
                {{ foundations[i - 1][foundations[i - 1].length - 1] }}
              </div>
            </div>
          </div>
          <div class="tableau">
            <div v-for="(pile, i) in tableau" :key="i" class="tableau-pile">
              <div v-for="(card, j) in pile" :key="j" class="card" :style="{ marginTop: j * 20 + 'px' }">
                {{ card }}
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const foundations = ref([[], [], [], []])
const tableau = ref([
  ['A♠'], ['2♥'], ['3♦'], ['4♣'], ['5♠'], ['6♥'], ['7♦']
])

function resetGame () {
  foundations.value = [[], [], [], []]
  tableau.value = [
    ['A♠'], ['2♥'], ['3♦'], ['4♣'], ['5♠'], ['6♥'], ['7♦']
  ]
}
</script>

<style scoped>
.game-container { max-width: 500px; width: 100%; }
.solitaire-area { min-height: 400px; }
.foundation-piles { display: flex; gap: 10px; margin-bottom: 20px; }
.foundation-pile { width: 60px; height: 80px; border: 2px dashed #ccc; }
.tableau { display: flex; gap: 10px; }
.tableau-pile { min-width: 60px; position: relative; }
.card { width: 60px; height: 80px; border: 1px solid #333; background: #fff; display: flex; align-items: center; justify-content: center; position: relative; }
</style>
