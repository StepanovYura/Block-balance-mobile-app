import {Block, GameState} from '../types/game.types';
import {GAME_CONFIG, COLORS} from './Constants';

export class GameLogic {
  private state: GameState;
  private config = GAME_CONFIG;

  constructor() {
    this.state = {
      score: 0,
      highScore: 0,
      level: 1, // Можно оставить для совместимости, но не используем
      isPlaying: false,
      isGameOver: false,
      tower: [],
      currentBlock: null,
      speedMultiplier: 1,
      streak: 0,
      lastBlockWidth: this.config.initialBlockWidth,
    };
  }

  startGame(): GameState {
    // Первый неподвижный блок внизу экрана
    const baseBlock: Block = {
      id: Date.now() + 1,
      width: this.config.initialBlockWidth,
      height: this.config.blockHeight,
      color: COLORS.blockColors[0],
      x: (this.config.screenWidth - this.config.initialBlockWidth) / 2,
      y: this.config.screenHeight - this.config.blockHeight * 4,
      speed: 0,
      isMoving: false,
      direction: 'right',
      perfectHit: false,
    };

    this.state = {
      ...this.state,
      isPlaying: true,
      isGameOver: false,
      score: 0,
      level: 1, // Устанавливаем 1, но не используем
      tower: [baseBlock],
      currentBlock: this.createNewBlock(),
      speedMultiplier: 1,
      streak: 0,
      lastBlockWidth: this.config.initialBlockWidth,
    };

    return this.state;
  }

  createNewBlock(): Block {
    const lastBlock = this.state.tower[this.state.tower.length - 1];
    const direction = Math.random() > 0.5 ? 'left' : 'right';
    
    const uniqueId = Date.now() + Math.floor(Math.random() * 10000);

    return {
      id: uniqueId,
      width: this.state.lastBlockWidth,
      height: this.config.blockHeight,
      color: COLORS.blockColors[this.state.tower.length % COLORS.blockColors.length],
      x: direction === 'left' ? 0 : this.config.screenWidth - this.state.lastBlockWidth,
      y: 100,
      speed: this.config.baseSpeed * this.state.speedMultiplier,
      isMoving: true,
      direction,
      perfectHit: false,
    };
  }

  updateBlockPosition(): GameState {
    if (!this.state.currentBlock || !this.state.isPlaying) return this.state;

    const block = {...this.state.currentBlock};
    
    // Движение влево-вправо
    if (block.direction === 'left') {
      block.x += block.speed;
      if (block.x + block.width >= this.config.screenWidth) {
        block.direction = 'right';
      }
    } else {
      block.x -= block.speed;
      if (block.x <= 0) {
        block.direction = 'left';
      }
    }

    this.state.currentBlock = block;
    return this.state;
  }

  placeBlock(): GameState {
    if (!this.state.currentBlock || !this.state.isPlaying) return this.state;

    const lastBlock = this.state.tower[this.state.tower.length - 1];
    const currentBlock = this.state.currentBlock;

    // Расчёт пересечения с предыдущим блоком
    const overlapStart = Math.max(lastBlock.x, currentBlock.x);
    const overlapEnd = Math.min(
      lastBlock.x + lastBlock.width,
      currentBlock.x + currentBlock.width
    );
    const overlapWidth = overlapEnd - overlapStart;

    // Проверка на проигрыш
    if (overlapWidth <= this.config.minBlockWidth) {
      this.state.isGameOver = true;
      this.state.isPlaying = false;
      return this.state;
    }

    // Проверка на идеальное попадание
    const isPerfect = Math.abs(lastBlock.x - currentBlock.x) < this.config.perfectThreshold;
    
    // Новый блок (обрезанный по ширине)
    const newBlock: Block = {
      ...currentBlock,
      width: overlapWidth,
      x: overlapStart,
      y: lastBlock.y - this.config.blockHeight,
      isMoving: false,
      perfectHit: isPerfect,
    };

    // Обновление счёта
    let scoreIncrease = 1;
    if (isPerfect) {
      scoreIncrease = 3;
      this.state.streak += 1;
    } else {
      this.state.streak = 0;
    }

    const newScore = this.state.score + scoreIncrease;
    
    // Увеличение скорости на основе счёта, а не уровня
    const scoreThreshold = 5; // Увеличиваем скорость каждые 5 очков
    const speedIncreaseFactor = Math.floor(newScore / scoreThreshold);
    
    const newSpeedMultiplier = Math.min(
      this.config.maxSpeed,
      1 + (speedIncreaseFactor * 0.2) // Увеличиваем на 20% каждые 5 очков
    );

    this.state = {
      ...this.state,
      score: newScore,
      highScore: Math.max(this.state.highScore, newScore),
      level: 1, // Оставляем 1, но не используем
      tower: [...this.state.tower, newBlock],
      currentBlock: this.createNewBlock(),
      speedMultiplier: newSpeedMultiplier,
      lastBlockWidth: overlapWidth,
    };

    return this.state;
  }

  getState(): GameState {
    return {...this.state};
  }

  resetGame(): GameState {
    this.state = {
      score: 0,
      highScore: this.state.highScore,
      level: 1,
      isPlaying: false,
      isGameOver: false,
      tower: [],
      currentBlock: null,
      speedMultiplier: 1,
      streak: 0,
      lastBlockWidth: this.config.initialBlockWidth,
    };
    return this.state;
  }
}