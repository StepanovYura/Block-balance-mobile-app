// Интерфейс для игрового блока
export interface Block {
  id: number;
  width: number;
  height: number;
  color: string;
  x: number; // Позиция по X
  y: number; // Позиция по Y
  speed: number;
  isMoving: boolean;
  direction: 'left' | 'right';
  perfectHit: boolean; // Флаг идеального попадания
}

// Состояние игры
export interface GameState {
  score: number; // Текущий счет
  highScore: number; // Рекорд
  level: number; // Уровень (не используется в текущей реализации)
  isPlaying: boolean; // Игра активна
  isGameOver: boolean; // Игра окончена
  tower: Block[]; // Построенная башня
  currentBlock: Block | null; // Текущий движущийся блок
  speedMultiplier: number; // Множитель скорости
  streak: number; // Серия идеальных попаданий
  lastBlockWidth: number; // Ширина последнего блока
}

// Конфигурация игры
export interface GameConfig {
  initialBlockWidth: number; // Начальная ширина блока
  blockHeight: number; // Высота блока
  minBlockWidth: number; // Минимальная ширина блока
  screenWidth: number; // Ширина экрана
  screenHeight: number; // Высота экрана
  baseSpeed: number; // Базовая скорость
  speedIncreaseFactor: number; // Коэффициент увеличения скорости
  maxSpeed: number; // Максимальная скорость
  perfectThreshold: number; // Порог для идеального попадания (в пикселях)
}

// Настройки приложения
export interface Settings {
  soundEnabled: boolean; // Звуковые эффекты
  musicEnabled: boolean; // Фоновая музыка
  vibrationEnabled: boolean; // Вибрация
}

// Типы экранов приложения
export type ScreenType = 'main' | 'game' | 'settings';