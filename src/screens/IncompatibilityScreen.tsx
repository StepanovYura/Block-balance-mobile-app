import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Alert,
  Image,
} from 'react-native';
import { COLORS } from '../game/Constants';

interface IncompatibilityScreenProps {
  message: string;
  storeUrl?: string;
  onRetry?: () => void;
  onExit?: () => void;
}

const IncompatibilityScreen: React.FC<IncompatibilityScreenProps> = ({
  message,
  storeUrl,
  onRetry,
  onExit,
}) => {
  const handleUpdate = () => {
    if (storeUrl) {
      Linking.openURL(storeUrl).catch(() => {
        alert('Не удалось открыть магазин приложений');
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Иконка предупреждения */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>⚠️</Text>
        </View>
        
        {/* Заголовок */}
        <Text style={styles.title}>Несовместимое устройство</Text>
        
        {/* Сообщение */}
        <View style={styles.messageContainer}>
          <Text style={styles.message}>{message}</Text>
        </View>
        
        {/* Дополнительная информация */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Минимальные требования:</Text>
          <Text style={styles.infoItem}>• Android 8.0 (Oreo) или выше</Text>
          <Text style={styles.infoItem}>• 2 ГБ оперативной памяти</Text>
          <Text style={styles.infoItem}>• Обновленный Google Play Services</Text>
        </View>
        
        {/* Кнопки действий */}
        <View style={styles.buttonsContainer}>
          {storeUrl && (
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
              <Text style={styles.updateButtonText}>Обновить Android</Text>
            </TouchableOpacity>
          )}
          
          {onRetry && (
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
              <Text style={styles.retryButtonText}>Попробовать всё равно</Text>
            </TouchableOpacity>
          )}
          
          {onExit && (
            <TouchableOpacity style={styles.exitButton} onPress={onExit}>
              <Text style={styles.exitButtonText}>Выйти из приложения</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Контактная информация */}
        <View style={styles.contactContainer}>
          <Text style={styles.contactText}>
            Если вы считаете, что это ошибка, свяжитесь с поддержкой:
          </Text>
          <Text style={styles.contactEmail}>support@blocktower.game</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 30,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 20,
    textAlign: 'center',
  },
  messageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    width: '100%',
  },
  message: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 22,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.3)',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  infoItem: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
    marginLeft: 10,
  },
  buttonsContainer: {
    width: '100%',
    marginBottom: 30,
  },
  updateButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#f39c12',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  exitButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  exitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  contactContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 5,
  },
  contactEmail: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
  },
});

export default IncompatibilityScreen;