import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, View } from 'react-native';
import MainMenu from './src/screens/MainMenu';
import GameScreen from './src/screens/GameScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import NavigationBar from './src/components/NavigationBar';
import { GameLogic } from './src/game/GameLogic';
import { Storage } from './src/utils/Storage';
import { GameState, Settings, ScreenType } from './src/types/game.types';

const gameLogic = new GameLogic();

const App = () => {
  const [gameState, setGameState] = useState<GameState>(gameLogic.getState());
  const [highScore, setHighScore] = useState(0);
  const [activeScreen, setActiveScreen] = useState<ScreenType>('main');
  const [settings, setSettings] = useState<Settings>({
    soundEnabled: true,
    musicEnabled: true,
    vibrationEnabled: true,
  });
  
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Загрузка рекорда и настроек при старте
  useEffect(() => {
    loadHighScore();
    loadSettings();
  }, []);

  const loadHighScore = async () => {
    const savedScore = await Storage.getHighScore();
    setHighScore(savedScore);
    setGameState(prevState => ({
      ...prevState,
      highScore: savedScore,
    }));
  };

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

  const saveSettings = async (newSettings: Settings) => {
    setSettings(newSettings);
    try {
      await Storage.saveSettings(newSettings);
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error);
    }
  };

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

  // Игровой цикл
  const startGameLoop = () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }

    gameLoopRef.current = setInterval(() => {
      if (gameState.isPlaying && !gameState.isGameOver) {
        const newState = gameLogic.updateBlockPosition();
        setGameState(newState);
      }
    }, 16);
  };

  const handleStartGame = () => {
    const newState = gameLogic.startGame();
    setGameState(newState);
    setActiveScreen('game');
    startGameLoop(); // Запускаем игровой цикл
  };

  const handlePlaceBlock = () => {
    if (!gameState.isPlaying || gameState.isGameOver) return;

    const newState = gameLogic.placeBlock();
    setGameState(newState);

    if (newState.score > highScore) {
      saveHighScore(newState.score);
    }

    // Виброотклик при установке блока
    if (settings.vibrationEnabled) {
      // Здесь можно добавить вибрацию
      // Vibration.vibrate(newState.currentBlock?.perfectHit ? 100 : 50);
    }

    if (newState.isGameOver && gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  };

  const handleRestart = () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    const newState = gameLogic.startGame();
    setGameState(newState);
    startGameLoop(); // Запускаем игровой цикл заново
  };

  const handleBackToMenu = () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    const resetState = gameLogic.getState();
    setGameState(resetState);
    setActiveScreen('main');
  };

  const handleNavigate = (screen: ScreenType) => {
    if (screen === 'game' && !gameState.isPlaying) {
      handleStartGame();
    } else {
      setActiveScreen(screen);
    }
  };

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, []);

  // Игровой цикл с useEffect
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
      
      {/* Основной контент */}
      <SafeAreaView style={styles.content}>
        {renderScreen()}
      </SafeAreaView>

      {/* Навигационная панель с динамической кнопкой */}
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