import AsyncStorage from '@react-native-async-storage/async-storage';

// Интерфейс настроек приложения
interface StorageSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  avatarUri?: string; // URI аватара пользователя
}

// Ключи для хранения данных
const HIGH_SCORE_KEY = '@blockbalance_high_score';
const SETTINGS_KEY = '@blockbalance_settings';
const AVATAR_KEY = '@blockbalance_avatar'; // Отдельный ключ для аватара

export const Storage = {
  // Получение рекорда из хранилища
  async getHighScore(): Promise<number> {
    try {
      const value = await AsyncStorage.getItem(HIGH_SCORE_KEY);
      return value ? parseInt(value, 10) : 0;
    } catch (error) {
      console.error('Ошибка чтения рекорда:', error);
      return 0;
    }
  },

  // Сохранение рекорда
  async saveHighScore(score: number): Promise<void> {
    try {
      await AsyncStorage.setItem(HIGH_SCORE_KEY, score.toString());
    } catch (error) {
      console.error('Ошибка сохранения рекорда:', error);
    }
  },

  // Получение настроек приложения
  async getSettings(): Promise<StorageSettings | null> {
    try {
      const value = await AsyncStorage.getItem(SETTINGS_KEY);
      if (value) {
        return JSON.parse(value);
      }
      return null;
    } catch (error) {
      console.error('Ошибка чтения настроек:', error);
      return null;
    }
  },

  // Сохранение настроек приложения
  async saveSettings(settings: StorageSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error);
    }
  },

  // Получение аватара пользователя
  async getAvatar(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(AVATAR_KEY);
    } catch (error) {
      console.error('Ошибка чтения аватара:', error);
      return null;
    }
  },

  // Сохранение аватара пользователя
  async saveAvatar(avatarUri: string): Promise<void> {
    try {
      await AsyncStorage.setItem(AVATAR_KEY, avatarUri);
    } catch (error) {
      console.error('Ошибка сохранения аватара:', error);
    }
  },

  // Очистка всего хранилища
  async clearStorage(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Ошибка очистки хранилища:', error);
    }
  },
};