import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Block as BlockType} from '../types/game.types';

// Пропсы для компонента блока
interface BlockProps {
  block: BlockType; // Данные блока
  isCurrent?: boolean; // Флаг текущего движущегося блока
}

const Block: React.FC<BlockProps> = ({block, isCurrent = false}) => {
  // Определяем цвет рамки в зависимости от типа попадания
  const borderColor = block.perfectHit ? '#2ecc71' : 'transparent';
  const borderWidth = block.perfectHit ? 4 : 0;

  return (
    <View
      style={[
        styles.block,
        {
          width: block.width,
          height: block.height,
          backgroundColor: block.color,
          left: block.x,
          top: block.y,
          borderColor,
          borderWidth,
          opacity: isCurrent ? 0.9 : 1, // Немного прозрачный текущий блок
        },
      ]}>
      {/* Эффект свечения для текущего блока */}
      {isCurrent && <View style={styles.glowEffect} />}
      
      {/* Бейдж для идеального попадания */}
      {block.perfectHit && (
        <View style={styles.perfectBadge}>
          <View style={styles.perfectInner} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  block: {
    position: 'absolute',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  glowEffect: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)', // Свечение белым цветом
  },
  perfectBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2ecc71', // Зеленый цвет для идеального попадания
    justifyContent: 'center',
    alignItems: 'center',
  },
  perfectInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
});

export default Block;