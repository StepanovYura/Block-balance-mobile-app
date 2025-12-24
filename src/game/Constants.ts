import {Dimensions} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export const GAME_CONFIG = {
  initialBlockWidth: 200,
  blockHeight: 50,
  minBlockWidth: 40,
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  baseSpeed: 4,
  speedIncreaseFactor: 1.05,
  maxSpeed: 12,
  perfectThreshold: 10, // пикселей для идеального попадания
};

export const COLORS = {
  background: '#87CEEB',
  perfect: '#2ecc71',
  good: '#3498db',
  miss: '#e74c3c',
  blockColors: ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#1abc9c'],
};

export const GAME_TEXT = {
  gameTitle: 'BLOCK TOWER',
  startButton: 'СТАРТ',
  restartButton: 'ЗАНОВО',
  highScore: 'РЕКОРД',
  score: 'СЧЕТ',
  // level: 'УРОВЕНЬ',
  perfect: 'ИДЕАЛЬНО!',
  gameOver: 'ПРОИГРЫШ',
};