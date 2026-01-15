import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, View, PermissionsAndroid, Platform } from 'react-native';
import MainMenu from './src/screens/MainMenu';
import GameScreen from './src/screens/GameScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import NavigationBar from './src/components/NavigationBar';
import { GameLogic } from './src/game/GameLogic';
import { Storage } from './src/utils/Storage';
import { GameState, Settings, ScreenType } from './src/types/game.types';
import SimpleAudio from './src/utils/SimpleAudio';

// Создаем экземпляр игровой логики
const gameLogic = new GameLogic();

const App = () => {
  // Состояние игры
  const [gameState, setGameState] = useState<GameState>(gameLogic.getState());
  const [highScore, setHighScore] = useState(0);
  const [activeScreen, setActiveScreen] = useState<ScreenType>('main');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>({
    soundEnabled: true,
    musicEnabled: true,
    vibrationEnabled: true,
  });
   const [permissionsRequested, setPermissionsRequested] = useState(false);
  
  // Референс для игрового цикла
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Загрузка рекорда и настроек при старте приложения
  // useEffect(() => {
  //   loadHighScore();
  //   loadSettings();
  //   loadAvatar();
  // }, []);

   useEffect(() => {
    const initializeApp = async () => {
      await loadHighScore();
      await loadSettings();
      await loadAvatar();
      await checkAndRequestPermissions();
    };
    
    initializeApp();
  }, []);

  useEffect(() => {
    SimpleAudio.updateSettings(settings);
  }, [settings]);

   // Функция запроса разрешений для Android
  const requestMediaPermissions = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      // Проверяем версию Android
      const isAndroid13OrHigher = Platform.Version >= 33;
      
      if (isAndroid13OrHigher) {
        // Для Android 13+ используем READ_MEDIA_IMAGES
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: "Доступ к фотографиям",
            message: "Приложению требуется доступ к вашим фотографиям для выбора аватара",
            buttonNeutral: "Спросить позже",
            buttonNegative: "Отмена",
            buttonPositive: "Разрешить"
          }
        );
        
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // Для Android < 13 используем READ_EXTERNAL_STORAGE
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Доступ к хранилищу",
            message: "Приложению требуется доступ к хранилищу для выбора аватара",
            buttonNeutral: "Спросить позже",
            buttonNegative: "Отмена",
            buttonPositive: "Разрешить"
          }
        );
        
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn('Ошибка запроса разрешений:', err);
      return false;
    }
  };

  // Функция проверки и запроса разрешений
  const checkAndRequestPermissions = async () => {
    if (Platform.OS !== 'android') return;

    try {
      // Проверяем, запрашивали ли уже разрешения
      const hasRequested = await Storage.getPermissionsRequested();
      if (hasRequested) {
        setPermissionsRequested(true);
        return;
      }

      // Запрашиваем разрешения при первом запуске
      const granted = await requestMediaPermissions();
      
      if (granted) {
        console.log('Разрешения на доступ к медиа предоставлены');
      } else {
        console.log('Разрешения на доступ к медиа отклонены');
        // Можно показать сообщение, но не обязательно
        // Alert.alert(
        //   'Внимание',
        //   'Без разрешения вы не сможете выбрать аватар из галереи. Вы можете предоставить разрешение позже в настройках приложения.',
        //   [{ text: 'Понятно' }]
        // );
      }

      // Сохраняем флаг, что запрашивали разрешения
      await Storage.savePermissionsRequested(true);
      setPermissionsRequested(true);
      
    } catch (error) {
      console.error('Ошибка при проверке разрешений:', error);
    }
  };


  // Загрузка рекорда из хранилища - УБИРАЕМ дублирование
  const loadHighScore = async () => {
    const savedScore = await Storage.getHighScore();
    setHighScore(savedScore);
    // НЕ обновляем gameState.highScore здесь - GameLogic будет использовать свою копию
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
    SimpleAudio.updateSettings(newSettings);
    setSettings(newSettings);

    try {
      await Storage.saveSettings(newSettings);
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error);
    }
  };

  // Функция загрузки аватара
  const loadAvatar = async () => {
    try {
      const savedAvatarUri = await Storage.getAvatar();
      if (savedAvatarUri) {
        setAvatarUri(savedAvatarUri);
      }
    } catch (error) {
      console.error('Ошибка загрузки аватара:', error);
    }
  };

  // Функция для изменения аватара
  const handleAvatarChange = async (uri: string) => {
    setAvatarUri(uri);
    try {
      await Storage.saveAvatar(uri); // Сохраняем в Storage
    } catch (error) {
      console.error('Ошибка сохранения аватара:', error);
    }
  };

  // Сохранение нового рекорда
  const saveHighScore = async (score: number) => {
    if (score > highScore) {
      setHighScore(score);
      await Storage.saveHighScore(score);
      // Обновляем GameLogic
      const currentState = gameLogic.getState();
      gameLogic.setState({ ...currentState, highScore: score });
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

    SimpleAudio.playClick();
  };

  // Установка блока на башню
  const handlePlaceBlock = () => {
    if (!gameState.isPlaying || gameState.isGameOver) return;

    const newState = gameLogic.placeBlock();
    setGameState(newState);

    const isPerfect = newState.currentBlock?.perfectHit || false;
    SimpleAudio.playBlockPlace(isPerfect);

    // Сохраняем рекорд если побили
    if (newState.score > highScore) {
      saveHighScore(newState.score);
      SimpleAudio.playSuccess();
    }

    // Останавливаем игровой цикл при проигрыше
    if (newState.isGameOver && gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
      SimpleAudio.playGameOver();
    }
  };

  // Перезапуск игры
  const handleRestart = () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }

    SimpleAudio.playClick();

    // Сбрасываем игровую логику полностью
    gameLogic.resetGame(); // Добавляем полный сброс

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

    // Сбрасываем игровую логику полностью
    gameLogic.resetGame(); // Добавляем полный сброс

    const resetState = gameLogic.getState();
    setGameState(resetState);
    setActiveScreen('main');
  };

  // Навигация между экранами
  const handleNavigate = (screen: ScreenType) => {

    SimpleAudio.playClick();

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
            avatarUri={avatarUri} 
            onStartGame={() => handleNavigate('game')}
            onAvatarPress={() => handleNavigate('settings')} 
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
            avatarUri={avatarUri}
            onSettingsChange={saveSettings}
            onAvatarChange={handleAvatarChange}
            onNavigate={handleNavigate}
            onRequestPermissions={requestMediaPermissions}
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