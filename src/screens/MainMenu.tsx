import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Avatar from '../components/Avatar';
import { GAME_TEXT, COLORS } from '../game/Constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

      <View style={styles.header}>
        <Text style={styles.title}>{GAME_TEXT.gameTitle}</Text>
        <Text style={styles.subtitle}>Балансируй башню!</Text>
      </View>

      <View style={styles.highScoreContainer}>
        <Text style={styles.highScoreLabel}>{GAME_TEXT.highScore}</Text>
        <Text style={styles.highScoreValue}>{highScore}</Text>
      </View>

      <TouchableOpacity style={styles.startButton} onPress={onStartGame}>
        <Text style={styles.startButtonText}>{GAME_TEXT.startButton}</Text>
      </TouchableOpacity>

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>• Нажимайте когда блок над башней</Text>
        <Text style={styles.instructionText}>• Блоки ускоряются со временем</Text>
        <Text style={styles.instructionText}>• Не уроните башню!</Text>
      </View>
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
    top: 50,
    left: 30,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
    marginTop: 40, // Добавляем отступ сверху для аватара
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#7f8c8d',
  },
  highScoreContainer: {
    position: 'absolute',
    top: 50,
    right: 30,
    alignItems: 'flex-end',
  },
  highScoreLabel: {
    fontSize: 16,
    color: '#95a5a6',
    marginBottom: 5,
  },
  highScoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#9b59b6',
  },
  startButton: {
    backgroundColor: '#2ecc71',
    width: SCREEN_WIDTH * 0.7,
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  instructions: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
  },
  instructionText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginVertical: 5,
    textAlign: 'center',
  },
});

export default MainMenu;