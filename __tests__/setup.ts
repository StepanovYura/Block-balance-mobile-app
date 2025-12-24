// Настройка глобальных моков для тестовой среды
import '@testing-library/jest-native/extend-expect';

// Мок для AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Мок для Dimensions
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: () => ({
    width: 375,
    height: 667,
    scale: 2,
    fontScale: 1,
  }),
}));

// Мок для Vibration
jest.mock('react-native/Libraries/Vibration/Vibration', () => ({
  vibrate: jest.fn(),
  cancel: jest.fn(),
}));

// Глобальные переменные для тестов
global.console = {
  ...console,
  log: jest.fn(), // Отключаем логи в тестах
  error: jest.fn(),
  warn: jest.fn(),
};

// Очистка моков после каждого теста
afterEach(() => {
  jest.clearAllMocks();
});

// Установка таймаутов
jest.setTimeout(10000);

console.log('🧪 Тестовая среда инициализирована');