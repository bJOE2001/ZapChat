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
