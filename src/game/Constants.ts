import {Dimensions} from 'react-native';

// Получение размеров экрана
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// Конфигурация игры
export const GAME_CONFIG = {
  initialBlockWidth: 200, // Начальная ширина блока
  blockHeight: 50, // Высота блока
  minBlockWidth: 40, // Минимальная ширина блока
  screenWidth: SCREEN_WIDTH, // Ширина экрана устройства
  screenHeight: SCREEN_HEIGHT, // Высота экрана устройства
  baseSpeed: 4, // Базовая скорость движения блока
  speedIncreaseFactor: 1.05, // Коэффициент увеличения скорости
  maxSpeed: 12, // Максимальная скорость
  perfectThreshold: 10, // Порог в пикселях для идеального попадания
};

// Цвета игры
export const COLORS = {
  background: '#87CEEB', // Цвет фона (небесно-голубой)
  perfect: '#2ecc71', // Цвет для идеального попадания
  good: '#3498db', // Цвет для хорошего попадания
  miss: '#e74c3c', // Цвет для промаха
  blockColors: ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#1abc9c'], // Цвета блоков
};

// Тексты игры
export const GAME_TEXT = {
  gameTitle: 'BLOCK TOWER', // Название игры
  startButton: 'СТАРТ', // Текст кнопки старта
  restartButton: 'ЗАНОВО', // Текст кнопки рестарта
  highScore: 'РЕКОРД', // Заголовок рекорда
  score: 'СЧЕТ', // Заголовок счета
  perfect: 'ИДЕАЛЬНО!', // Текст идеального попадания
  gameOver: 'ПРОИГРЫШ', // Текст при проигрыше
};