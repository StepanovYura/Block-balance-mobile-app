import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

// Пропсы для компонента аватара
interface AvatarProps {
  uri?: string | null; // URI изображения
  size?: number; // Размер аватара
  onPress?: () => void; // Обработчик нажатия
  editable?: boolean; // Возможность редактирования
}

const Avatar: React.FC<AvatarProps> = ({ 
  uri, 
  size = 50, 
  onPress, 
  editable = false 
}) => {
  // Стандартный аватар (нужно создать файл assets/default-avatar.png)
  const defaultAvatar = require('../assets/default-avatar.png');

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2, // Делаем круг
  };

  const content = (
    <View style={[styles.container, avatarStyle]}>
      {/* Изображение аватара */}
      <Image
        source={uri ? { uri } : defaultAvatar}
        style={[styles.avatar, avatarStyle]}
        resizeMode="cover"
      />
      {/* Иконка редактирования (если включено) */}
      {editable && (
        <View style={styles.editOverlay}>
          <View style={styles.editIcon}>
            <View style={styles.editLine1} />
            <View style={styles.editLine2} />
          </View>
        </View>
      )}
    </View>
  );

  // Если есть обработчик нажатия - оборачиваем в TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ecf0f1', // Цвет фона по умолчанию
    borderWidth: 2,
    borderColor: '#3498db', // Синяя рамка
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  editOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Полупрозрачный оверлей
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    width: 20,
    height: 20,
    backgroundColor: 'white',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editLine1: {
    width: 10,
    height: 2,
    backgroundColor: '#3498db',
    position: 'absolute',
    top: 6,
  },
  editLine2: {
    width: 2,
    height: 10,
    backgroundColor: '#3498db',
    position: 'absolute',
    left: 9,
  },
});

export default Avatar;