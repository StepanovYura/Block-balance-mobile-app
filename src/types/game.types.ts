export interface Block {
  id: number;
  width: number;
  height: number;
  color: string;
  x: number;
  y: number;
  speed: number;
  isMoving: boolean;
  direction: 'left' | 'right';
  perfectHit: boolean;
}

export interface GameState {
  score: number;
  highScore: number;
  level: number;
  isPlaying: boolean;
  isGameOver: boolean;
  tower: Block[];
  currentBlock: Block | null;
  speedMultiplier: number;
  streak: number;
  lastBlockWidth: number;
}

export interface GameConfig {
  initialBlockWidth: number;
  blockHeight: number;
  minBlockWidth: number;
  screenWidth: number;
  screenHeight: number;
  baseSpeed: number;
  speedIncreaseFactor: number;
  maxSpeed: number;
  perfectThreshold: number;
}

export interface Settings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
}

export type ScreenType = 'main' | 'game' | 'settings';