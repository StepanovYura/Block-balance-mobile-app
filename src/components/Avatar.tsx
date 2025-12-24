import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface AvatarProps {
  uri?: string | null;
  size?: number;
  onPress?: () => void;
  editable?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ 
  uri, 
  size = 50, 
  onPress, 
  editable = false 
}) => {
  const defaultAvatar = require('../assets/default-avatar.png'); // Создайте этот файл

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const content = (
    <View style={[styles.container, avatarStyle]}>
      <Image
        source={uri ? { uri } : defaultAvatar}
        style={[styles.avatar, avatarStyle]}
        resizeMode="cover"
      />
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
    backgroundColor: '#ecf0f1',
    borderWidth: 2,
    borderColor: '#3498db',
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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