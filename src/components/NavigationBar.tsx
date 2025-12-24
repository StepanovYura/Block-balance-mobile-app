import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ScreenType } from '../types/game.types';
import { COLORS } from '../game/Constants';

// Пропсы для навигационной панели
interface NavigationBarProps {
  activeScreen: ScreenType; // Активный экран
  onNavigate: (screen: ScreenType) => void; // Навигация
  onRestart?: () => void; // Перезапуск игры
  isGamePlaying?: boolean; // Флаг активной игры
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  activeScreen,
  onNavigate,
  onRestart,
  isGamePlaying = false,
}) => {
  // Проверка активности экрана
  const isActive = (screen: ScreenType) => activeScreen === screen;

  return (
    <View style={styles.container}>
      <View style={styles.navContainer}>
        {/* Кнопка Главная */}
        <TouchableOpacity
          style={[styles.navItem, isActive('main') && styles.navItemActive]}
          onPress={() => onNavigate('main')}
          activeOpacity={0.6}>
          <Text style={[styles.navIcon, isActive('main') && styles.navIconActive]}>
            🏠
          </Text>
          <Text style={[styles.navLabel, isActive('main') && styles.navLabelActive]}>
            Главная
          </Text>
        </TouchableOpacity>

        {/* Динамическая кнопка: Играть/Заново */}
        {activeScreen === 'game' && isGamePlaying && onRestart ? (
          // Если в игре и игра идет - показываем кнопку "Заново"
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onRestart}
            activeOpacity={0.7}>
            <Text style={styles.actionButtonIcon}>🔄</Text>
            <Text style={styles.actionButtonText}>Заново</Text>
          </TouchableOpacity>
        ) : (
          // Во всех остальных случаях - кнопка "Играть"
          <TouchableOpacity
            style={[styles.navItem, isActive('game') && styles.navItemActive]}
            onPress={() => onNavigate('game')}
            activeOpacity={0.6}>
            <Text style={[styles.navIcon, isActive('game') && styles.navIconActive]}>
              🎮
            </Text>
            <Text style={[styles.navLabel, isActive('game') && styles.navLabelActive]}>
              Играть
            </Text>
          </TouchableOpacity>
        )}

        {/* Кнопка Настройки */}
        <TouchableOpacity
          style={[styles.navItem, isActive('settings') && styles.navItemActive]}
          onPress={() => onNavigate('settings')}
          activeOpacity={0.6}>
          <Text style={[styles.navIcon, isActive('settings') && styles.navIconActive]}>
            ⚙️
          </Text>
          <Text style={[styles.navLabel, isActive('settings') && styles.navLabelActive]}>
            Настройки
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 2,
    borderTopColor: '#ecf0f1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    minWidth: 80,
  },
  navItemActive: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)', // Подсветка активного элемента
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.7,
  },
  navIconActive: {
    opacity: 1,
    transform: [{ scale: 1.1 }], // Увеличение активной иконки
  },
  navLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  navLabelActive: {
    color: COLORS.primary || '#3498db',
    fontWeight: 'bold',
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(231, 76, 60, 0.1)', // Красный фон для кнопки "Заново"
    minWidth: 80,
  },
  actionButtonIcon: {
    fontSize: 24,
    marginBottom: 4,
    color: '#e74c3c',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
});

export default NavigationBar;