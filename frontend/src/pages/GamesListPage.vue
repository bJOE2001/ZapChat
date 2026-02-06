<template>
  <q-page class="games-list-page">
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="arrow_back" @click="$router.push('/')" />
      <q-toolbar-title class="text-weight-bold">Mini Games</q-toolbar-title>
    </q-toolbar>

    <q-scroll-area class="games-scroll-area">
      <div class="q-pa-md">
        <div class="text-h5 q-mb-md text-weight-medium">Choose a Game</div>
        
        <div class="row q-col-gutter-md">
          <div
            v-for="(game, index) in games"
            :key="game.id"
            class="col-12 col-sm-6 col-md-4 col-lg-3"
          >
            <q-card
              :class="['game-tile', 'cursor-pointer', `tile-${index % 8}`]"
              :style="getTileStyle(game, index)"
              @click="startGame(game.id)"
            >
              <div class="game-tile-header" :style="getHeaderStyle(game, index)">
                <q-icon :name="game.icon" size="64px" :color="getIconColor(index)" />
              </div>
              <q-card-section>
                <div class="text-h6 text-weight-medium" :style="{ color: getTextColor(index) }">
                  {{ game.name }}
                </div>
                <div class="text-caption" :style="{ color: getDescriptionColor(index) }">
                  {{ game.description }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </q-scroll-area>
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
  { id: 'colormatch', name: 'Color Match', description: 'Match the target color', icon: 'palette' },
  { id: 'chess', name: 'Chess', description: 'Classic strategy board game', icon: 'workspace_premium' },
  { id: 'checkers', name: 'Checkers', description: 'Jump and capture pieces', icon: 'crop_square' },
  { id: 'flappy', name: 'Flappy Bird', description: 'Navigate through pipes', icon: 'flight' },
  { id: 'dots', name: 'Dots & Boxes', description: 'Connect dots to form boxes', icon: 'radio_button_unchecked' },
  { id: 'brickbreaker', name: 'Brick Breaker', description: 'Break all the bricks', icon: 'sports_esports' },
  { id: 'asteroids', name: 'Asteroids', description: 'Destroy asteroids in space', icon: 'brightness_3' },
  { id: 'battleship', name: 'Battleship', description: 'Sink enemy ships', icon: 'directions_boat' },
  { id: 'blackjack', name: 'Blackjack', description: 'Beat the dealer', icon: 'casino' },
  { id: 'bowling', name: 'Bowling', description: 'Knock down pins', icon: 'sports_bowling' },
  { id: 'bubbleshooter', name: 'Bubble Shooter', description: 'Pop matching bubbles', icon: 'bubble_chart' },
  { id: 'candycrush', name: 'Candy Crush', description: 'Match colorful candies', icon: 'cake' },
  { id: 'crossword', name: 'Crossword', description: 'Solve word puzzles', icon: 'grid_4x4' },
  { id: 'dice', name: 'Dice Roll', description: 'Roll the dice', icon: 'casino' },
  { id: 'frogger', name: 'Frogger', description: 'Cross the road safely', icon: 'pets' },
  { id: 'galaga', name: 'Galaga', description: 'Classic space shooter', icon: 'rocket_launch' },
  { id: 'go', name: 'Go', description: 'Ancient strategy game', icon: 'radio_button_checked' },
  { id: 'jigsaw', name: 'Jigsaw Puzzle', description: 'Solve picture puzzles', icon: 'extension' },
  { id: 'keno', name: 'Keno', description: 'Pick winning numbers', icon: 'confirmation_number' },
  { id: 'ludo', name: 'Ludo', description: 'Race to the finish', icon: 'sports_esports' },
  { id: 'mahjong', name: 'Mahjong', description: 'Match tile pairs', icon: 'apps' },
  { id: 'monopoly', name: 'Monopoly', description: 'Buy and trade properties', icon: 'account_balance' },
  { id: 'pacman', name: 'Pac-Man', description: 'Eat dots and avoid ghosts', icon: 'sentiment_satisfied' },
  { id: 'poker', name: 'Poker', description: 'Play poker hands', icon: 'style' },
  { id: 'roulette', name: 'Roulette', description: 'Spin the wheel', icon: 'toll' },
  { id: 'scrabble', name: 'Scrabble', description: 'Form words for points', icon: 'text_fields' },
  { id: 'solitaire', name: 'Solitaire', description: 'Classic card game', icon: 'layers' },
  { id: 'spaceinvaders', name: 'Space Invaders', description: 'Defend Earth', icon: 'rocket' },
  { id: 'towerdefense', name: 'Tower Defense', description: 'Build towers to defend', icon: 'castle' },
  { id: 'yahtzee', name: 'Yahtzee', description: 'Roll dice and score', icon: 'casino' },
  { id: 'zombie', name: 'Zombie Shooter', description: 'Survive the zombie horde', icon: 'bug_report' },
  { id: 'angrybirds', name: 'Angry Birds', description: 'Launch birds at targets', icon: 'pets' },
  { id: 'bejeweled', name: 'Bejeweled', description: 'Match gems in rows', icon: 'diamond' },
  { id: 'bingo', name: 'Bingo', description: 'Mark numbers on your card', icon: 'confirmation_number' },
  { id: 'blockpuzzle', name: 'Block Puzzle', description: 'Fill lines to clear', icon: 'view_module' },
  { id: 'bubblepop', name: 'Bubble Pop', description: 'Pop all the bubbles', icon: 'bubble_chart' }
])

const tileColors = [
  { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: '#fff', desc: 'rgba(255,255,255,0.8)' },
  { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', text: '#fff', desc: 'rgba(255,255,255,0.8)' },
  { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', text: '#fff', desc: 'rgba(255,255,255,0.8)' },
  { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', text: '#fff', desc: 'rgba(255,255,255,0.8)' },
  { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', text: '#fff', desc: 'rgba(255,255,255,0.8)' },
  { bg: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', text: '#fff', desc: 'rgba(255,255,255,0.8)' },
  { bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', text: '#333', desc: 'rgba(0,0,0,0.7)' },
  { bg: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', text: '#333', desc: 'rgba(0,0,0,0.7)' }
]

function getTileStyle (game, index) {
  const colorIndex = index % tileColors.length
  return {
    background: tileColors[colorIndex].bg,
    border: `3px solid ${index % 2 === 0 ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)'}`
  }
}

function getHeaderStyle (game, index) {
  return {
    background: `rgba(0,0,0,${0.1 + (index % 3) * 0.1})`,
    borderRadius: '12px 12px 0 0'
  }
}

function getIconColor (index) {
  return index % 2 === 0 ? 'white' : '#fff'
}

function getTextColor (index) {
  const colorIndex = index % tileColors.length
  return tileColors[colorIndex].text
}

function getDescriptionColor (index) {
  const colorIndex = index % tileColors.length
  return tileColors[colorIndex].desc
}

function startGame (gameId) {
  router.push(`/games/${gameId}`)
}
</script>

<style scoped>
.games-list-page {
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.games-scroll-area {
  flex: 1;
  height: 100%;
}

.game-tile {
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 12px;
  overflow: hidden;
  min-height: 180px;
  display: flex;
  flex-direction: column;
}

.game-tile:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.game-tile-header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}

.game-tile.tile-0 {
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.game-tile.tile-1 {
  box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
}

.game-tile.tile-2 {
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.4);
}

.game-tile.tile-3 {
  box-shadow: 0 4px 15px rgba(67, 233, 123, 0.4);
}

.game-tile.tile-4 {
  box-shadow: 0 4px 15px rgba(250, 112, 154, 0.4);
}

.game-tile.tile-5 {
  box-shadow: 0 4px 15px rgba(48, 207, 208, 0.4);
}

.game-tile.tile-6 {
  box-shadow: 0 4px 15px rgba(168, 237, 234, 0.4);
}

.game-tile.tile-7 {
  box-shadow: 0 4px 15px rgba(255, 154, 158, 0.4);
}
</style>
