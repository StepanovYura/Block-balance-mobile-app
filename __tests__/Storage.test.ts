import AsyncStorage from '@react-native-async-storage/async-storage';
import { Storage } from '../src/utils/Storage';

// Мок для AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

describe('Storage', () => {
  // Очистка перед каждым тестом
  beforeEach(async () => {
    await AsyncStorage.clear();
    console.log('🧹 Очистка хранилища перед тестом');
  });

  describe('Рекорды', () => {
    test('должен возвращать 0 если рекорд не установлен', async () => {
      const highScore = await Storage.getHighScore();
      expect(highScore).toBe(0);
      console.log('✅ Рекорд по умолчанию - 0');
    });

    test('должен корректно сохранять и загружать рекорд', async () => {
      const testScore = 150;
      
      await Storage.saveHighScore(testScore);
      const loadedScore = await Storage.getHighScore();
      
      expect(loadedScore).toBe(testScore);
      console.log(`✅ Рекорд ${testScore} успешно сохранен и загружен`);
    });

    test('должен обновлять рекорд только если новый больше', async () => {
      await Storage.saveHighScore(100);
      await Storage.saveHighScore(50); // Меньше текущего
      
      const finalScore = await Storage.getHighScore();
      expect(finalScore).toBe(100);
      console.log('✅ Рекорд не обновлен меньшим значением');
    });
  });

  describe('Настройки', () => {
    test('должен возвращать null если настройки не сохранены', async () => {
      const settings = await Storage.getSettings();
      expect(settings).toBeNull();
      console.log('✅ Настройки по умолчанию - null');
    });

    test('должен корректно сохранять и загружать настройки', async () => {
      const testSettings = {
        soundEnabled: false,
        musicEnabled: true,
        vibrationEnabled: false,
      };
      
      await Storage.saveSettings(testSettings);
      const loadedSettings = await Storage.getSettings();
      
      expect(loadedSettings).toEqual(testSettings);
      console.log('✅ Настройки успешно сохранены и загружены');
    });

    test('должен сохранять полную структуру настроек', async () => {
      const testSettings = {
        soundEnabled: true,
        musicEnabled: false,
        vibrationEnabled: true,
        avatarUri: 'https://example.com/avatar.png',
      };
      
      await Storage.saveSettings(testSettings);
      const loadedSettings = await Storage.getSettings();
      
      expect(loadedSettings).toMatchObject(testSettings);
      expect(loadedSettings?.avatarUri).toBe(testSettings.avatarUri);
    });
  });

  describe('Аватары', () => {
    test('должен сохранять и загружать URI аватара', async () => {
      const testAvatarUri = 'content://com.example.provider/avatar123.png';
      
      await Storage.saveAvatar(testAvatarUri);
      const loadedAvatar = await Storage.getAvatar();
      
      expect(loadedAvatar).toBe(testAvatarUri);
      console.log('✅ Аватар успешно сохранен и загружен');
    });

    test('должен возвращать null если аватар не установлен', async () => {
      const avatar = await Storage.getAvatar();
      expect(avatar).toBeNull();
    });
  });

  describe('Очистка хранилища', () => {
    test('должен полностью очищать хранилище', async () => {
      // Сохраняем тестовые данные
      await Storage.saveHighScore(200);
      await Storage.saveSettings({
        soundEnabled: true,
        musicEnabled: true,
        vibrationEnabled: true,
      });
      await Storage.saveAvatar('test://avatar');
      
      // Очищаем
      await Storage.clearStorage();
      
      // Проверяем что всё очищено
      const highScore = await Storage.getHighScore();
      const settings = await Storage.getSettings();
      const avatar = await Storage.getAvatar();
      
      expect(highScore).toBe(0);
      expect(settings).toBeNull();
      expect(avatar).toBeNull();
      
      console.log('✅ Хранилище полностью очищено');
    });
  });

  describe('Обработка ошибок', () => {
    test('должен обрабатывать ошибки чтения', async () => {
      // Симулируем ошибку чтения
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Read error'));
      
      // Метод должен вернуть значение по умолчанию, а не сломаться
      const highScore = await Storage.getHighScore();
      expect(highScore).toBe(0);
      
      console.log('✅ Ошибка чтения корректно обработана');
    });

    test('должен обрабатывать ошибки записи', async () => {
      // Симулируем ошибку записи
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('Write error'));
      
      // Метод не должен выбрасывать исключение
      await expect(Storage.saveHighScore(100)).resolves.not.toThrow();
      
      console.log('✅ Ошибка записи корректно обработана');
    });
  });
});