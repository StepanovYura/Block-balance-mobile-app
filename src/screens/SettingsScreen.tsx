import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import Switch from '../components/Switch';
import Avatar from '../components/Avatar';
import { Settings } from '../types/game.types';
import { COLORS } from '../game/Constants';

// Пропсы для экрана настроек
interface SettingsScreenProps {
  settings: Settings;
  avatarUri?: string | null;
  onSettingsChange: (settings: Settings) => void;
  onAvatarChange: (uri: string) => void;
  onNavigate: (screen: 'main' | 'game' | 'settings') => void;
  onRequestPermissions?: () => Promise<boolean>;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  avatarUri,
  onSettingsChange,
  onAvatarChange,
  onNavigate,
  onRequestPermissions,
}) => {
  const [isChangingAvatar, setIsChangingAvatar] = useState(false);

  // Переключение настроек
  const handleToggle = (key: keyof Settings) => {
    onSettingsChange({
      ...settings,
      [key]: !settings[key],
    });
  };

  // Обработчик смены аватара
  const handleChangeAvatar = async () => {
    if (isChangingAvatar) return;

    if (Platform.OS === 'android') {
      try {
        let hasPermission = false;
        const isAndroid13OrHigher = Platform.Version >= 33;
        
        if (isAndroid13OrHigher) {
          hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          );
        } else {
          hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
          );
        }
        
        if (!hasPermission && onRequestPermissions) {
          const granted = await onRequestPermissions();
          if (!granted) {
            Alert.alert(
              'Доступ запрещен',
              'Для выбора аватара из галереи необходимо предоставить разрешение на доступ к фотографиям. Вы можете предоставить его в настройках устройства.',
              [{ text: 'Понятно' }]
            );
            return;
          }
        }
      } catch (error) {
        console.warn('Ошибка проверки разрешений:', error);
      }
    }
    
    Alert.alert(
      'Сменить аватар',
      'Выберите способ',
      [
        {
          text: 'Выбрать из галереи',
          onPress: () => pickImage(),
        },
        {
          text: 'Сбросить на стандартный',
          onPress: () => resetAvatar(),
          style: 'destructive',
        },
        {
          text: 'Отмена',
          style: 'cancel',
          onPress: () => setIsChangingAvatar(false),
        },
      ]
    );
  };

  // Выбор изображения из галереи
  const pickImage = async () => {
    setIsChangingAvatar(true);
    
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Ошибка', 'Не удалось выбрать изображение');
      } else if (response.assets && response.assets[0].uri) {
        const uri = response.assets[0].uri;
        onAvatarChange(uri);
        Alert.alert('Успех', 'Аватар успешно обновлен!');
      }
      setIsChangingAvatar(false);
    });
  };

  // Сброс аватара на стандартный
  const resetAvatar = () => {
    onAvatarChange(''); // Пустая строка для сброса
    setIsChangingAvatar(false);
    Alert.alert('Успех', 'Аватар сброшен на стандартный');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Заголовок экрана */}
      <View style={styles.header}>
        <Text style={styles.title}>НАСТРОЙКИ</Text>
        <Text style={styles.subtitle}>Настройте игру под себя</Text>
      </View>

      {/* Основной контент с прокруткой */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* Раздел профиля пользователя */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Профиль</Text>
          
          <View style={styles.profileCard}>
            <View style={styles.avatarSection}>
              <Avatar 
                uri={avatarUri} 
                size={80} 
                onPress={handleChangeAvatar}
                editable={true}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Игрок</Text>
                <Text style={styles.profileStatus}>Рекордсмен</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.changeAvatarButton}
              onPress={handleChangeAvatar}
              disabled={isChangingAvatar}>
              <Text style={styles.changeAvatarButtonText}>
                {isChangingAvatar ? 'Загрузка...' : 'Изменить аватар'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Раздел настроек звука */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Звуки</Text>
          
          <Switch
            value={settings.soundEnabled}
            onValueChange={() => handleToggle('soundEnabled')}
            label="Эффекты"
            description="Звуки блоков, попаданий и т.д."
          />
          
          <Switch
            value={settings.musicEnabled}
            onValueChange={() => handleToggle('musicEnabled')}
            label="Фоновая музыка"
            description="Музыкальное сопровождение"
          />
        </View>

        {/* Раздел настроек вибрации */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Виброотклик</Text>
          
          <Switch
            value={settings.vibrationEnabled}
            onValueChange={() => handleToggle('vibrationEnabled')}
            label="Вибрация"
            description="Тактильная обратная связь"
          />
        </View>

        {/* Раздел информации об игре */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Об игре</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Block Tower</Text>
            <Text style={styles.infoText}>
              Построй самую высокую башню!{'\n'}
              Координация и точность — ключ к успеху.
            </Text>
            
            <View style={styles.versionContainer}>
              <Text style={styles.versionText}>Версия 1.0.0</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 2,
    borderBottomColor: '#ecf0f1',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
    marginLeft: 5,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileInfo: {
    marginLeft: 20,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  profileStatus: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  changeAvatarButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  changeAvatarButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 15,
    color: '#7f8c8d',
    lineHeight: 22,
    marginBottom: 15,
  },
  versionContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 15,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#95a5a6',
    fontStyle: 'italic',
  },
  bottomSpacer: {
    height: 20,
  },
});

export default SettingsScreen;