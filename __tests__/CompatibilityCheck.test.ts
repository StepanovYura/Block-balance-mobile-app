import { Platform } from 'react-native';
import CompatibilityCheck, { MIN_REQUIREMENTS } from '../src/utils/CompatibilityCheck';

// Моки для Platform
jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
    Version: 26,
  },
}));

describe('CompatibilityCheck', () => {
  describe('Проверка совместимости Android', () => {
    test('должен возвращать совместимость для Android 8.0+', () => {
      (Platform as any).Version = 26; // Android 8.0
      
      const result = CompatibilityCheck.checkCompatibility();
      
      expect(result.isCompatible).toBe(true);
      expect(result.message).toBeUndefined();
      
      console.log('✅ Android 8.0 совместим');
    });

    test('должен возвращать несовместимость для Android 7.0', () => {
      (Platform as any).Version = 24; // Android 7.0
      
      const result = CompatibilityCheck.checkCompatibility();
      
      expect(result.isCompatible).toBe(false);
      expect(result.message).toContain('Android 7.0');
      expect(result.message).toContain(MIN_REQUIREMENTS.ANDROID.MIN_VERSION_NAME);
      
      console.log('✅ Android 7.0 правильно определен как несовместимый');
    });

    test('должен возвращать совместимость для Android 10+', () => {
      (Platform as any).Version = 29; // Android 10
      
      const result = CompatibilityCheck.checkCompatibility();
      
      expect(result.isCompatible).toBe(true);
      
      console.log('✅ Android 10+ совместим');
    });
  });

  describe('Проверка функций', () => {
    test('должен возвращать предупреждения для старых устройств', () => {
      (Platform as any).Version = 24; // Android 7.0
      
      const warnings = CompatibilityCheck.checkFeatures();
      
      expect(warnings).toContain('Некоторые функции могут не работать из-за устаревшего WebView');
      expect(warnings).toContain('Для оптимальной работы рекомендуется 2+ ГБ ОЗУ');
      
      console.log('✅ Предупреждения корректно генерируются');
    });

    test('не должен возвращать предупреждения о WebView для Android 7.0+', () => {
      (Platform as any).Version = 28; // Android 9.0
      
      const warnings = CompatibilityCheck.checkFeatures();
      
      const webViewWarning = warnings.find(w => w.includes('WebView'));
      expect(webViewWarning).toBeUndefined();
      
      console.log('✅ WebView предупреждение отсутствует для Android 9.0+');
    });
  });

  describe('Вспомогательные методы', () => {
    test('должен корректно преобразовывать API level в название версии', () => {
      expect(CompatibilityCheck['getAndroidVersionName'](21)).toBe('5.0 (Lollipop)');
      expect(CompatibilityCheck['getAndroidVersionName'](26)).toBe('8.0 (Oreo)');
      expect(CompatibilityCheck['getAndroidVersionName'](30)).toBe('11.0');
      expect(CompatibilityCheck['getAndroidVersionName'](99)).toBe('API 99');
      
      console.log('✅ Преобразование API level корректно');
    });

    test('должен определять поддержку WebView', () => {
      // Приватный метод, тестируем через рефлексию
      const isWebViewSupported = CompatibilityCheck['isWebViewSupported'];
      
      (Platform as any).Version = 23; // Android 6.0
      expect(isWebViewSupported.call(CompatibilityCheck)).toBe(false);
      
      (Platform as any).Version = 24; // Android 7.0
      expect(isWebViewSupported.call(CompatibilityCheck)).toBe(true);
      
      (Platform as any).Version = 30; // Android 11
      expect(isWebViewSupported.call(CompatibilityCheck)).toBe(true);
      
      console.log('✅ Проверка WebView работает корректно');
    });
  });

  describe('iOS совместимость', () => {
    test('должен возвращать совместимость для iOS', () => {
      (Platform as any).OS = 'ios';
      
      const result = CompatibilityCheck.checkCompatibility();
      
      expect(result.isCompatible).toBe(true);
      
      console.log('✅ iOS совместим (базовая проверка)');
    });
  });

  describe('Обработка ошибок', () => {
    test('должен корректно обрабатывать неизвестные платформы', () => {
      (Platform as any).OS = 'windows'; // Неподдерживаемая платформа
      
      const result = CompatibilityCheck.checkCompatibility();
      
      expect(result.isCompatible).toBe(true); // По умолчанию совместимо
      
      console.log('✅ Неизвестная платформа обработана');
    });

    test('должен обрабатывать некорректный Version', () => {
      (Platform as any).Version = 'invalid'; // Некорректное значение
      
      const result = CompatibilityCheck.checkCompatibility();
      
      expect(result.isCompatible).toBe(true); // Безопасное значение по умолчанию
      
      console.log('✅ Некорректный Version обработан');
    });
  });
});