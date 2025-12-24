import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Пропсы для компонента Switch
interface SwitchProps {
  value: boolean; // Текущее значение
  onValueChange: (value: boolean) => void; // Обработчик изменения
  label: string; // Основной текст
  description?: string; // Описание (опционально)
}

// Кастомный компонент переключателя
const Switch: React.FC<SwitchProps> = ({ value, onValueChange, label, description }) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      
      {/* Сам переключатель */}
      <TouchableOpacity
        style={[styles.switch, value ? styles.switchOn : styles.switchOff]}
        onPress={() => onValueChange(!value)}
        activeOpacity={0.7}>
        <View style={[styles.thumb, value ? styles.thumbOn : styles.thumbOff]} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  switch: {
    width: 60,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 3,
    marginLeft: 15,
  },
  switchOn: {
    backgroundColor: '#2ecc71', // Зеленый для включенного состояния
  },
  switchOff: {
    backgroundColor: '#bdc3c7', // Серый для выключенного состояния
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbOn: {
    alignSelf: 'flex-end', // Сдвиг вправо при включении
  },
  thumbOff: {
    alignSelf: 'flex-start', // Сдвиг влево при выключении
  },
});

export default Switch;