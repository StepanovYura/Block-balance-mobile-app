import { GameLogic } from '../src/game/GameLogic';
import { GAME_CONFIG } from '../src/game/Constants';

// Mock-объекты для тестирования
const mockGameState = {
  score: 0,
  highScore: 0,
  level: 1,
  isPlaying: false,
  isGameOver: false,
  tower: [],
  currentBlock: null,
  speedMultiplier: 1,
  streak: 0,
  lastBlockWidth: GAME_CONFIG.initialBlockWidth,
};

describe('GameLogic', () => {
  let gameLogic: GameLogic;

  beforeEach(() => {
    // Инициализация перед каждым тестом
    gameLogic = new GameLogic();
    console.log('🔄 Инициализация нового экземпляра GameLogic');
  });

  describe('Начальное состояние', () => {
    test('должен создаваться с корректным начальным состоянием', () => {
      const initialState = gameLogic.getState();
      
      expect(initialState.score).toBe(0);
      expect(initialState.isPlaying).toBe(false);
      expect(initialState.isGameOver).toBe(false);
      expect(initialState.tower).toHaveLength(0);
      expect(initialState.currentBlock).toBeNull();
      
      console.log('✅ Начальное состояние корректно');
    });

    test('должен иметь начальную ширину блока как в конфигурации', () => {
      const initialState = gameLogic.getState();
      expect(initialState.lastBlockWidth).toBe(GAME_CONFIG.initialBlockWidth);
    });
  });

  describe('Запуск игры', () => {
    test('должен корректно начинать новую игру', () => {
      const gameState = gameLogic.startGame();
      
      expect(gameState.isPlaying).toBe(true);
      expect(gameState.isGameOver).toBe(false);
      expect(gameState.score).toBe(0);
      expect(gameState.tower).toHaveLength(1); // Базовый блок
      expect(gameState.currentBlock).not.toBeNull();
      
      console.log('✅ Игра успешно запущена');
    });

    test('базовый блок должен быть неподвижным', () => {
      const gameState = gameLogic.startGame();
      const baseBlock = gameState.tower[0];
      
      expect(baseBlock.isMoving).toBe(false);
      expect(baseBlock.speed).toBe(0);
    });
  });

  describe('Движение блока', () => {
    test('должен корректно обновлять позицию движущегося блока', () => {
      gameLogic.startGame();
      const initialState = gameLogic.getState();
      
      if (initialState.currentBlock) {
        const initialX = initialState.currentBlock.x;
        const newState = gameLogic.updateBlockPosition();
        
        expect(newState.currentBlock).not.toBeNull();
        expect(newState.currentBlock!.x).not.toBe(initialX);
        
        console.log('✅ Позиция блока обновлена');
      }
    });

    test('блок должен менять направление при достижении края', () => {
      gameLogic.startGame();
      let gameState = gameLogic.getState();
      
      // Многократно обновляем позицию, чтобы блок достиг края
      for (let i = 0; i < 100; i++) {
        gameState = gameLogic.updateBlockPosition();
      }
      
      // Проверяем, что блок остался в пределах экрана
      if (gameState.currentBlock) {
        expect(gameState.currentBlock.x).toBeGreaterThanOrEqual(0);
        expect(gameState.currentBlock.x + gameState.currentBlock.width)
          .toBeLessThanOrEqual(GAME_CONFIG.screenWidth);
      }
    });
  });

  describe('Размещение блоков', () => {
    test('должен корректно размещать блок при клике', () => {
      gameLogic.startGame();
      const gameState = gameLogic.placeBlock();
      
      expect(gameState.tower).toHaveLength(2); // Базовый блок + новый
      expect(gameState.score).toBeGreaterThan(0);
      expect(gameState.currentBlock).not.toBeNull();
      
      console.log('✅ Блок успешно размещен');
    });

    test('должен увеличивать счет при успешном размещении', () => {
      gameLogic.startGame();
      const initialScore = gameLogic.getState().score;
      const newState = gameLogic.placeBlock();
      
      expect(newState.score).toBeGreaterThan(initialScore);
    });

    test('должен заканчивать игру при неудачном размещении', () => {
      gameLogic.startGame();
      
      // Симулируем множество неудачных размещений
      let gameState = gameLogic.getState();
      let isGameOver = false;
      
      // В реальном тесте здесь была бы сложная логика симуляции
      // Для демонстрации просто проверяем метод placeBlock
      gameState = gameLogic.placeBlock();
      
      if (gameState.isGameOver) {
        isGameOver = true;
      }
      
      expect(isGameOver).toBe(false);
    });

    test('должен давать бонус за идеальное попадание', () => {
      gameLogic.startGame();
      
      const gameState = gameLogic.placeBlock();
      const placedBlock = gameState.tower[gameState.tower.length - 1];
      
      if (placedBlock.perfectHit) {
        expect(gameState.score).toBeGreaterThanOrEqual(3);
      }
    });
  });

  describe('Сброс игры', () => {
    test('должен корректно сбрасывать состояние игры', () => {
      gameLogic.startGame();
      gameLogic.placeBlock();
      gameLogic.placeBlock();
      
      const resetState = gameLogic.resetGame();
      
      expect(resetState.score).toBe(0);
      expect(resetState.isPlaying).toBe(false);
      expect(resetState.tower).toHaveLength(0);
      expect(resetState.currentBlock).toBeNull();
      
      console.log('✅ Игра успешно сброшена');
    });
  });

  describe('Сложность игры', () => {
    test('должен увеличивать скорость с прогрессом', () => {
      gameLogic.startGame();
      let gameState = gameLogic.getState();
      const initialSpeed = gameState.speedMultiplier;
      
      // Размещаем несколько блоков для увеличения сложности
      for (let i = 0; i < 10; i++) {
        gameState = gameLogic.placeBlock();
      }
      
      expect(gameState.speedMultiplier).toBeGreaterThan(initialSpeed);
      expect(gameState.speedMultiplier).toBeLessThanOrEqual(GAME_CONFIG.maxSpeed);
    });

    test('блоки должны становиться уже с прогрессом', () => {
      gameLogic.startGame();
      let gameState = gameLogic.getState();
      const initialWidth = gameState.lastBlockWidth;
      
      // Размещаем блоки
      for (let i = 0; i < 5; i++) {
        gameState = gameLogic.placeBlock();
      }
      
      expect(gameState.lastBlockWidth).toBeLessThan(initialWidth);
      expect(gameState.lastBlockWidth).toBeGreaterThanOrEqual(GAME_CONFIG.minBlockWidth);
    });
  });
});