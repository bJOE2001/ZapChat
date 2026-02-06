<template>
  <q-page class="games-list-page">
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/')" />
      <q-toolbar-title class="text-weight-bold">Mini Games</q-toolbar-title>
    </q-toolbar>

    <div class="q-pa-md">
      <div class="text-h5 q-mb-md text-weight-medium">Choose a Game</div>
      
      <div class="row q-col-gutter-md">
        <div
          v-for="game in games"
          :key="game.id"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <q-card
            class="game-tile cursor-pointer"
            @click="startGame(game.id)"
          >
            <q-img
              :src="game.image"
              :alt="game.name"
              class="game-image"
              :ratio="16/9"
            >
              <div class="absolute-full flex flex-center bg-dark-transparent">
                <q-icon :name="game.icon" size="64px" color="white" />
              </div>
            </q-img>
            <q-card-section>
              <div class="text-h6 text-weight-medium">{{ game.name }}</div>
              <div class="text-caption text-grey-7">{{ game.description }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const games = ref([
  { id: 'sudoku', name: 'Sudoku', description: 'Classic number puzzle game', icon: 'grid_on' },
  { id: 'snake', name: 'Snake', description: 'Classic arcade snake game', icon: 'games' },
  { id: 'guessing', name: 'Number Guessing', description: 'Guess the number between 1-100', icon: 'help_outline' },
  { id: 'tictactoe', name: 'Tic Tac Toe', description: 'Play against AI', icon: 'close' },
  { id: 'memory', name: 'Memory Game', description: 'Match pairs of cards', icon: 'memory' },
  { id: 'hangman', name: 'Hangman', description: 'Guess the word letter by letter', icon: 'sentiment_very_dissatisfied' },
  { id: '2048', name: '2048', description: 'Slide tiles to reach 2048', icon: 'apps' },
  { id: 'tetris', name: 'Tetris', description: 'Classic falling blocks puzzle', icon: 'view_module' },
  { id: 'pong', name: 'Pong', description: 'Classic paddle ball game', icon: 'sports_tennis' },
  { id: 'breakout', name: 'Breakout', description: 'Break all the bricks', icon: 'sports_esports' },
  { id: 'simon', name: 'Simon Says', description: 'Repeat the color sequence', icon: 'repeat' },
  { id: 'rps', name: 'Rock Paper Scissors', description: 'Play against AI', icon: 'pan_tool' },
  { id: 'math', name: 'Math Quiz', description: 'Test your math skills', icon: 'calculate' },
  { id: 'reaction', name: 'Reaction Time', description: 'Test your reflexes', icon: 'timer' },
  { id: 'whack', name: 'Whack a Mole', description: 'Hit the moles as they appear', icon: 'pets' },
  { id: 'cardmatch', name: 'Card Match', description: 'Match pairs of cards', icon: 'style' },
  { id: 'puzzle', name: 'Puzzle Slider', description: 'Slide tiles to solve puzzle', icon: 'extension' },
  { id: 'trivia', name: 'Trivia Quiz', description: 'Answer trivia questions', icon: 'quiz' },
  { id: 'typing', name: 'Typing Test', description: 'Test your typing speed', icon: 'keyboard' },
  { id: 'connect4', name: 'Connect Four', description: 'Connect four in a row', icon: 'view_column' },
  { id: 'minesweeper', name: 'Minesweeper', description: 'Find all mines safely', icon: 'dangerous' },
  { id: 'wordsearch', name: 'Word Search', description: 'Find words in the grid', icon: 'search' },
  { id: 'colormatch', name: 'Color Match', description: 'Match the target color', icon: 'palette' }
])

function startGame (gameId) {
  router.push(`/games/${gameId}`)
}
</script>

<style scoped>
.games-list-page {
  background: #f5f5f5;
}

.game-tile {
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 12px;
  overflow: hidden;
}

.game-tile:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.game-image {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-dark-transparent {
  background: rgba(0, 0, 0, 0.3);
}
</style>
