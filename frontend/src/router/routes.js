const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/LoginPage.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('pages/RegisterPage.vue'),
    meta: { guest: true }
  },
  {
    path: '/',
    component: () => import('layouts/ChatLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'inbox',
        component: () => import('pages/InboxPage.vue')
      },
      {
        path: 'c/:id',
        name: 'conversation',
        component: () => import('pages/ConversationPage.vue')
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('pages/ProfilePage.vue')
      },
      {
        path: 'stories',
        name: 'stories',
        component: () => import('pages/StoriesPage.vue')
      },
      {
        path: 'games',
        name: 'games',
        component: () => import('pages/GamesListPage.vue')
      },
      {
        path: 'games/sudoku',
        name: 'game-sudoku',
        component: () => import('../games/SudokuGame.vue')
      },
      {
        path: 'games/snake',
        name: 'game-snake',
        component: () => import('../games/SnakeGame.vue')
      },
      {
        path: 'games/guessing',
        name: 'game-guessing',
        component: () => import('../games/GuessingGame.vue')
      },
      {
        path: 'games/tictactoe',
        name: 'game-tictactoe',
        component: () => import('../games/TicTacToeGame.vue')
      },
      {
        path: 'games/memory',
        name: 'game-memory',
        component: () => import('../games/MemoryGame.vue')
      },
      {
        path: 'games/hangman',
        name: 'game-hangman',
        component: () => import('../games/HangmanGame.vue')
      },
      {
        path: 'games/2048',
        name: 'game-2048',
        component: () => import('../games/Game2048.vue')
      },
      {
        path: 'games/tetris',
        name: 'game-tetris',
        component: () => import('../games/TetrisGame.vue')
      },
      {
        path: 'games/pong',
        name: 'game-pong',
        component: () => import('../games/PongGame.vue')
      },
      {
        path: 'games/breakout',
        name: 'game-breakout',
        component: () => import('../games/BreakoutGame.vue')
      },
      {
        path: 'games/simon',
        name: 'game-simon',
        component: () => import('../games/SimonSaysGame.vue')
      },
      {
        path: 'games/rps',
        name: 'game-rps',
        component: () => import('../games/RockPaperScissorsGame.vue')
      },
      {
        path: 'games/math',
        name: 'game-math',
        component: () => import('../games/MathQuizGame.vue')
      },
      {
        path: 'games/reaction',
        name: 'game-reaction',
        component: () => import('../games/ReactionTimeGame.vue')
      },
      {
        path: 'games/whack',
        name: 'game-whack',
        component: () => import('../games/WhackAMoleGame.vue')
      },
      {
        path: 'games/cardmatch',
        name: 'game-cardmatch',
        component: () => import('../games/CardMatchGame.vue')
      },
      {
        path: 'games/puzzle',
        name: 'game-puzzle',
        component: () => import('../games/PuzzleSliderGame.vue')
      },
      {
        path: 'games/trivia',
        name: 'game-trivia',
        component: () => import('../games/TriviaGame.vue')
      },
      {
        path: 'games/typing',
        name: 'game-typing',
        component: () => import('../games/TypingTestGame.vue')
      },
      {
        path: 'games/connect4',
        name: 'game-connect4',
        component: () => import('../games/ConnectFourGame.vue')
      },
      {
        path: 'games/minesweeper',
        name: 'game-minesweeper',
        component: () => import('../games/MinesweeperGame.vue')
      },
      {
        path: 'games/wordsearch',
        name: 'game-wordsearch',
        component: () => import('../games/WordSearchGame.vue')
      },
      {
        path: 'games/colormatch',
        name: 'game-colormatch',
        component: () => import('../games/ColorMatchGame.vue')
      },
      {
        path: 'games/chess',
        name: 'game-chess',
        component: () => import('../games/ChessGame.vue')
      },
      {
        path: 'games/checkers',
        name: 'game-checkers',
        component: () => import('../games/CheckersGame.vue')
      },
      {
        path: 'games/flappy',
        name: 'game-flappy',
        component: () => import('../games/FlappyBirdGame.vue')
      },
      {
        path: 'games/dots',
        name: 'game-dots',
        component: () => import('../games/DotsGame.vue')
      },
      {
        path: 'games/brickbreaker',
        name: 'game-brickbreaker',
        component: () => import('../games/BrickBreakerGame.vue')
      },
      {
        path: 'games/asteroids',
        name: 'game-asteroids',
        component: () => import('../games/AsteroidsGame.vue')
      },
      {
        path: 'games/battleship',
        name: 'game-battleship',
        component: () => import('../games/BattleshipGame.vue')
      },
      {
        path: 'games/blackjack',
        name: 'game-blackjack',
        component: () => import('../games/BlackjackGame.vue')
      },
      {
        path: 'games/bowling',
        name: 'game-bowling',
        component: () => import('../games/BowlingGame.vue')
      },
      {
        path: 'games/bubbleshooter',
        name: 'game-bubbleshooter',
        component: () => import('../games/BubbleShooterGame.vue')
      },
      {
        path: 'games/candycrush',
        name: 'game-candycrush',
        component: () => import('../games/CandyCrushGame.vue')
      },
      {
        path: 'games/crossword',
        name: 'game-crossword',
        component: () => import('../games/CrosswordGame.vue')
      },
      {
        path: 'games/dice',
        name: 'game-dice',
        component: () => import('../games/DiceGame.vue')
      },
      {
        path: 'games/frogger',
        name: 'game-frogger',
        component: () => import('../games/FroggerGame.vue')
      },
      {
        path: 'games/galaga',
        name: 'game-galaga',
        component: () => import('../games/GalagaGame.vue')
      },
      {
        path: 'games/go',
        name: 'game-go',
        component: () => import('../games/GoGame.vue')
      },
      {
        path: 'games/jigsaw',
        name: 'game-jigsaw',
        component: () => import('../games/JigsawGame.vue')
      },
      {
        path: 'games/keno',
        name: 'game-keno',
        component: () => import('../games/KenoGame.vue')
      },
      {
        path: 'games/ludo',
        name: 'game-ludo',
        component: () => import('../games/LudoGame.vue')
      },
      {
        path: 'games/mahjong',
        name: 'game-mahjong',
        component: () => import('../games/MahjongGame.vue')
      },
      {
        path: 'games/monopoly',
        name: 'game-monopoly',
        component: () => import('../games/MonopolyGame.vue')
      },
      {
        path: 'games/pacman',
        name: 'game-pacman',
        component: () => import('../games/PacmanGame.vue')
      },
      {
        path: 'games/poker',
        name: 'game-poker',
        component: () => import('../games/PokerGame.vue')
      },
      {
        path: 'games/roulette',
        name: 'game-roulette',
        component: () => import('../games/RouletteGame.vue')
      },
      {
        path: 'games/scrabble',
        name: 'game-scrabble',
        component: () => import('../games/ScrabbleGame.vue')
      },
      {
        path: 'games/solitaire',
        name: 'game-solitaire',
        component: () => import('../games/SolitaireGame.vue')
      },
      {
        path: 'games/spaceinvaders',
        name: 'game-spaceinvaders',
        component: () => import('../games/SpaceInvadersGame.vue')
      },
      {
        path: 'games/towerdefense',
        name: 'game-towerdefense',
        component: () => import('../games/TowerDefenseGame.vue')
      },
      {
        path: 'games/yahtzee',
        name: 'game-yahtzee',
        component: () => import('../games/YahtzeeGame.vue')
      },
      {
        path: 'games/zombie',
        name: 'game-zombie',
        component: () => import('../games/ZombieGame.vue')
      },
      {
        path: 'games/angrybirds',
        name: 'game-angrybirds',
        component: () => import('../games/AngryBirdsGame.vue')
      },
      {
        path: 'games/bejeweled',
        name: 'game-bejeweled',
        component: () => import('../games/BejeweledGame.vue')
      },
      {
        path: 'games/bingo',
        name: 'game-bingo',
        component: () => import('../games/BingoGame.vue')
      },
      {
        path: 'games/blockpuzzle',
        name: 'game-blockpuzzle',
        component: () => import('../games/BlockPuzzleGame.vue')
      },
      {
        path: 'games/bubblepop',
        name: 'game-bubblepop',
        component: () => import('../games/BubblePopGame.vue')
      },
      {
        path: 'notifications',
        name: 'notifications',
        component: () => import('pages/NotificationsPage.vue')
      }
    ]
  },
  {
    path: '/demo',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'index',
        component: () => import('pages/IndexPage.vue')
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
