import { Platform, Alert, Linking } from 'react-native';

// Минимальные требования к устройству
export const MIN_REQUIREMENTS = {
  ANDROID: {
    MIN_API: 26, // Android 8.0 (Oreo)
    MIN_VERSION_NAME: '8.0',
  },
  IOS: {
    MIN_VERSION: '12.0',
  },
};

// Класс для проверки совместимости устройства
export class CompatibilityCheck {
  // Основная проверка совместимости
  static checkCompatibility(): {
    isCompatible: boolean;
    message?: string;
    storeUrl?: string;
  } {
    if (Platform.OS === 'android') {
      return this.checkAndroidCompatibility();
    } else if (Platform.OS === 'ios') {
      return this.checkIOSCompatibility();
    }
    
    // Для других платформ считаем совместимым
    return { isCompatible: true };
  }

  // Проверка совместимости Android
  private static checkAndroidCompatibility() {
    // API level устройства (доступно только на Android)
    const apiLevel = Platform.Version;
    
    // Проверяем версию Android
    if (typeof apiLevel === 'number' && apiLevel < MIN_REQUIREMENTS.ANDROID.MIN_API) {
      const currentVersion = this.getAndroidVersionName(apiLevel);
      
      return {
        isCompatible: false,
        message: `Ваше устройство работает на Android ${currentVersion}. Для работы приложения требуется Android ${MIN_REQUIREMENTS.ANDROID.MIN_VERSION_NAME} или выше.`,
        storeUrl: 'market://details?id=com.google.android.gms',
      };
    }
    
    return { isCompatible: true };
  }

  // Проверка совместимости iOS
  private static checkIOSCompatibility() {
    // Для iOS сложнее проверить версию
    return { isCompatible: true };
  }

  // Преобразование API level в название версии Android
  private static getAndroidVersionName(apiLevel: number): string {
    const versionMap: Record<number, string> = {
      21: '5.0 (Lollipop)',
      22: '5.1 (Lollipop)',
      23: '6.0 (Marshmallow)',
      24: '7.0 (Nougat)',
      25: '7.1 (Nougat)',
      26: '8.0 (Oreo)',
      27: '8.1 (Oreo)',
      28: '9.0 (Pie)',
      29: '10.0',
      30: '11.0',
      31: '12.0',
      32: '12L',
      33: '13.0',
      34: '14.0',
      35: '15.0',
      36: '16.0',
    };
    
    return versionMap[apiLevel] || `API ${apiLevel}`;
  }

  // Проверка доступности функций устройства
  static checkFeatures(): string[] {
    const warnings: string[] = [];
    
    // Проверка поддержки WebView
    if (!this.isWebViewSupported()) {
      warnings.push('Некоторые функции могут не работать из-за устаревшего WebView');
    }
    
    // Проверка памяти (рекомендация)
    if (Platform.OS === 'android') {
      warnings.push('Для оптимальной работы рекомендуется 2+ ГБ ОЗУ');
    }
    
    return warnings;
  }

  // Проверка поддержки WebView
  private static isWebViewSupported(): boolean {
    const apiLevel = Platform.Version;
    return typeof apiLevel === 'number' && apiLevel >= 24; // Android 7.0+
  }

  // Показать Alert о несовместимости
  static showIncompatibilityAlert(
    message: string,
    storeUrl?: string,
    onRetry?: () => void
  ) {
    Alert.alert(
      'Несовместимое устройство',
      message,
      [
        {
          text: 'Обновить Android',
          onPress: () => {
            if (storeUrl) {
              Linking.openURL(storeUrl).catch(() => {
                Alert.alert('Ошибка', 'Не удалось открыть магазин приложений');
              });
            }
          },
        },
        {
          text: 'Попробовать всё равно',
          onPress: onRetry,
          style: 'destructive',
        },
        {
          text: 'Выйти',
          onPress: () => {
            // Закрытие приложения на Android
            if (Platform.OS === 'android') {
              const BackHandler = require('react-native').BackHandler;
              BackHandler.exitApp();
            }
          },
        },
      ],
      { cancelable: false }
    );
  }

  // Показать предупреждения о функциях
  static showWarnings(warnings: string[]) {
    if (warnings.length === 0) return;
    
    Alert.alert(
      'Предупреждения',
      warnings.join('\n\n'),
      [
        { text: 'Понятно', style: 'cancel' },
      ]
    );
  }
}

export default CompatibilityCheck;