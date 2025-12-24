import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, View } from 'react-native';
import MainMenu from './src/screens/MainMenu';
import GameScreen from './src/screens/GameScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import NavigationBar from './src/components/NavigationBar';
import { GameLogic } from './src/game/GameLogic';
import { Storage } from './src/utils/Storage';
import { GameState, Settings, ScreenType } from './src/types/game.types';

// Создаем экземпляр игровой логики
const gameLogic = new GameLogic();

const App = () => {
  // Состояние игры
  const [gameState, setGameState] = useState<GameState>(gameLogic.getState());
  const [highScore, setHighScore] = useState(0);
  const [activeScreen, setActiveScreen] = useState<ScreenType>('main');
  const [settings, setSettings] = useState<Settings>({
    soundEnabled: true,
    musicEnabled: true,
    vibrationEnabled: true,
  });
  
  // Референс для игрового цикла
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Загрузка рекорда и настроек при старте приложения
  useEffect(() => {
    loadHighScore();
    loadSettings();
  }, []);

  // Загрузка рекорда из хранилища
  const loadHighScore = async () => {
    const savedScore = await Storage.getHighScore();
    setHighScore(savedScore);
    setGameState(prevState => ({
      ...prevState,
      highScore: savedScore,
    }));
  };

  // Загрузка настроек из хранилища
  const loadSettings = async () => {
    try {
      const savedSettings = await Storage.getSettings();
      if (savedSettings) {
        setSettings(savedSettings);
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
    }
  };

  // Сохранение настроек
  const saveSettings = async (newSettings: Settings) => {
    setSettings(newSettings);
    try {
      await Storage.saveSettings(newSettings);
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error);
    }
  };

  // Сохранение нового рекорда
  const saveHighScore = async (score: number) => {
    if (score > highScore) {
      setHighScore(score);
      await Storage.saveHighScore(score);
      setGameState(prevState => ({
        ...prevState,
        highScore: score,
      }));
    }
  };

  // Запуск игрового цикла
  const startGameLoop = () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }

    // Устанавливаем интервал для обновления положения блока
    gameLoopRef.current = setInterval(() => {
      if (gameState.isPlaying && !gameState.isGameOver) {
        const newState = gameLogic.updateBlockPosition();
        setGameState(newState);
      }
    }, 16); // ~60 FPS
  };

  // Начало новой игры
  const handleStartGame = () => {
    const newState = gameLogic.startGame();
    setGameState(newState);
    setActiveScreen('game');
    startGameLoop(); // Запускаем игровой цикл
  };

  // Установка блока на башню
  const handlePlaceBlock = () => {
    if (!gameState.isPlaying || gameState.isGameOver) return;

    const newState = gameLogic.placeBlock();
    setGameState(newState);

    // Сохраняем рекорд если побили
    if (newState.score > highScore) {
      saveHighScore(newState.score);
    }

    // Виброотклик при установке блока (если включен)
    if (settings.vibrationEnabled) {
      // Реализация вибрации будет добавлена позже
      // Vibration.vibrate(newState.currentBlock?.perfectHit ? 100 : 50);
    }

    // Останавливаем игровой цикл при проигрыше
    if (newState.isGameOver && gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  };

  // Перезапуск игры
  const handleRestart = () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    const newState = gameLogic.startGame();
    setGameState(newState);
    startGameLoop(); // Запускаем игровой цикл заново
  };

  // Возврат в главное меню
  const handleBackToMenu = () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    const resetState = gameLogic.getState();
    setGameState(resetState);
    setActiveScreen('main');
  };

  // Навигация между экранами
  const handleNavigate = (screen: ScreenType) => {
    if (screen === 'game' && !gameState.isPlaying) {
      handleStartGame(); // Автоматически начинаем игру
    } else {
      setActiveScreen(screen);
    }
  };

  // Очистка интервалов при размонтировании компонента
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, []);

  // Альтернативная реализация игрового цикла через useEffect
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isGameOver && gameState.currentBlock) {
      const updateInterval = setInterval(() => {
        const newState = gameLogic.updateBlockPosition();
        setGameState(newState);
      }, 16);
      
      return () => clearInterval(updateInterval);
    }
  }, [gameState.isPlaying, gameState.isGameOver, gameState.currentBlock]);

  // Рендер активного экрана
  const renderScreen = () => {
    switch (activeScreen) {
      case 'main':
        return (
          <MainMenu 
            highScore={highScore} 
            onStartGame={() => handleNavigate('game')} 
          />
        );
      
      case 'game':
        return (
          <GameScreen
            gameState={gameState}
            onPlaceBlock={handlePlaceBlock}
            onRestart={handleRestart}
            onBackToMenu={handleBackToMenu}
          />
        );
      
      case 'settings':
        return (
          <SettingsScreen
            settings={settings}
            onSettingsChange={saveSettings}
            onNavigate={handleNavigate}
          />
        );
      
      default:
        return (
          <MainMenu 
            highScore={highScore} 
            onStartGame={() => handleNavigate('game')} 
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#87CEEB" />
      
      {/* Основной контент приложения */}
      <SafeAreaView style={styles.content}>
        {renderScreen()}
      </SafeAreaView>

      {/* Нижняя навигационная панель */}
      <NavigationBar
        activeScreen={activeScreen}
        onNavigate={handleNavigate}
        onRestart={activeScreen === 'game' ? handleRestart : undefined}
        isGamePlaying={gameState.isPlaying && !gameState.isGameOver}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginBottom: 70, // Отступ для навигационной панели
  },
});

export default App;