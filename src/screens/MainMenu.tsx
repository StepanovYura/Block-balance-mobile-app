import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Avatar from '../components/Avatar';
import { GAME_TEXT, COLORS } from '../game/Constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Пропсы для главного меню
interface MainMenuProps {
  highScore: number;
  avatarUri?: string | null;
  onStartGame: () => void;
  onAvatarPress?: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ 
  highScore, 
  avatarUri,
  onStartGame,
  onAvatarPress
}) => {
  return (
    <View style={styles.container}>
      {/* Аватар в левом верхнем углу */}
      <TouchableOpacity 
        style={styles.avatarContainer}
        onPress={onAvatarPress}
        activeOpacity={0.7}>
        <Avatar uri={avatarUri} size={60} />
      </TouchableOpacity>

      {/* Заголовок и подзаголовок игры */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleFirst}>BLOCK</Text>
          <Text style={styles.titleSecond}>BALANCE</Text>
        </View>
        <View style={styles.titleUnderline} />
        <Text style={styles.subtitle}>Постройте башню и не уроните блоки</Text>
      </View>

      {/* Отображение рекорда в правом верхнем углу */}
      <View style={styles.highScoreContainer}>
        <View style={styles.highScoreCard}>
          <Text style={styles.highScoreLabel}>{GAME_TEXT.highScore}</Text>
          <Text style={styles.highScoreValue}>{highScore}</Text>
        </View>
      </View>

      {/* Основная кнопка начала игры */}
      <TouchableOpacity 
        style={styles.startButton} 
        onPress={onStartGame}
        activeOpacity={0.8}>
        <Text style={styles.startButtonText}>{GAME_TEXT.startButton}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'absolute',
    top: 60,
    left: 30,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  header: {
    alignItems: 'center',
    marginBottom: 70,
    marginTop: 60,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  titleFirst: {
    fontSize: 48,
    fontWeight: '900',
    color: '#2c3e50',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 5,
    letterSpacing: 1.5,
  },
  titleSecond: {
    fontSize: 48,
    fontWeight: '900',
    color: '#3498db',
    textShadowColor: 'rgba(52, 152, 219, 0.3)',
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 5,
    letterSpacing: 1.5,
    marginTop: -8,
  },
  titleUnderline: {
    width: 180,
    height: 4,
    backgroundColor: '#3498db',
    borderRadius: 2,
    marginTop: 5,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#34495e',
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 24,
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  highScoreContainer: {
    position: 'absolute',
    top: 60,
    right: 30,
    alignItems: 'flex-end',
  },
  highScoreCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.2)',
  },
  highScoreLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '600',
    marginBottom: 4,
  },
  highScoreValue: {
    fontSize: 38,
    fontWeight: '800',
    color: '#9b59b6',
    textShadowColor: 'rgba(155, 89, 182, 0.3)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  startButton: {
    backgroundColor: '#2ecc71',
    width: SCREEN_WIDTH * 0.75,
    paddingVertical: 22,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  startButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
});

export default MainMenu;