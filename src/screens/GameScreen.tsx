import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Block from '../components/Block';
import {GameState} from '../types/game.types';
import {GAME_TEXT, COLORS} from '../game/Constants';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// Пропсы для игрового экрана
interface GameScreenProps {
  gameState: GameState;
  onPlaceBlock: () => void;
  onRestart: () => void;
  onBackToMenu: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
  gameState,
  onPlaceBlock,
  onRestart,
  onBackToMenu,
}) => {
  const gameAreaRef = useRef<View>(null);

  return (
    <SafeAreaView style={styles.container}>
      {/* Верхняя панель с информацией о счете и рекорде */}
      <View style={styles.topBar}>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>{GAME_TEXT.score}</Text>
          <Text style={styles.scoreValue}>{gameState.score}</Text>
        </View>
        
        <View style={styles.highScoreContainer}>
          <Text style={styles.highScoreLabel}>{GAME_TEXT.highScore}</Text>
          <Text style={styles.highScoreValue}>{gameState.highScore}</Text>
        </View>
      </View>

      {/* Основная игровая зона (область для установки блоков) */}
      <TouchableOpacity
        style={styles.gameArea}
        activeOpacity={1}
        onPress={onPlaceBlock}
        ref={gameAreaRef}>
        {/* Отображение построенной башни */}
        {gameState.tower.map(block => (
          <Block key={block.id} block={block} />
        ))}
        
        {/* Текущий движущийся блок */}
        {gameState.currentBlock && (
          <Block block={gameState.currentBlock} isCurrent={true} />
        )}
        
        {/* Инструкция для новых игроков */}
        {gameState.tower.length === 1 && (
          <View style={styles.instructionOverlay}>
            <Text style={styles.instructionText}>Нажимайте чтобы поставить блок!</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Экран Game Over (показывается при проигрыше) */}
      {gameState.isGameOver && (
        <View style={styles.gameOverOverlay}>
          <View style={styles.gameOverContent}>
            <Text style={styles.gameOverTitle}>{GAME_TEXT.gameOver}</Text>
            <Text style={styles.gameOverScore}>Счет: {gameState.score}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={onRestart}>
              <Text style={styles.retryButtonText}>Еще раз</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 2,
    borderBottomColor: '#ecf0f1',
  },
  scoreContainer: {
    alignItems: 'center',
    flex: 1,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3498db',
  },
  highScoreContainer: {
    alignItems: 'center',
    flex: 1,
  },
  highScoreLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  highScoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#9b59b6',
  },
  gameArea: {
    flex: 1,
    backgroundColor: 'rgba(135, 206, 235, 0.3)',
    position: 'relative',
    overflow: 'hidden',
  },
  instructionOverlay: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 15,
    marginHorizontal: 40,
  },
  instructionText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gameOverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.8,
  },
  gameOverTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#9b59b6',
    marginBottom: 20,
  },
  gameOverScore: {
    fontSize: 28,
    color: '#2c3e50',
    marginBottom: 30,
  },
  retryButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: '#3498db',
    borderRadius: 15,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default GameScreen;