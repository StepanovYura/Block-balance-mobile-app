import { Platform, Vibration } from 'react-native';

// Простой менеджер звуков (использует вибрацию как альтернативу звукам)
export class SimpleAudio {
  private enabled: boolean = true;

  constructor() {
    this.enabled = true;
  }

  // Включение/выключение звуков
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  // Воспроизведение приветственного звука
  playWelcome() {
    if (!this.enabled) return;

    console.log('🎵 Playing welcome sound');
    
    // Используем вибрацию для всех платформ
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      // Паттерн вибрации: короткая-длинная-короткая
      Vibration.vibrate([0, 100, 200, 100]);
    }
    
    // Для веб-версии только логируем
    if (Platform.OS === 'web') {
      console.log('Welcome sound would play here');
    }
  }

  // Воспроизведение звука клика
  playClick() {
    if (!this.enabled) return;
    
    console.log('🔘 Playing click sound');
    
    // Короткая вибрация для клика
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Vibration.vibrate(50);
    }
    
    if (Platform.OS === 'web') {
      console.log('Click sound would play here');
    }
  }

  // Воспроизведение звука успеха
  playSuccess() {
    if (!this.enabled) return;
    
    console.log('✅ Playing success sound');
    
    // Паттерн вибрации для успеха
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Vibration.vibrate([0, 100, 50, 100, 50, 100]);
    }
    
    if (Platform.OS === 'web') {
      console.log('Success sound would play here');
    }
  }

  // Воспроизведение звука неудачи
  playFail() {
    if (!this.enabled) return;
    
    console.log('❌ Playing fail sound');
    
    // Паттерн вибрации для ошибки
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Vibration.vibrate([0, 300, 100, 300]);
    }
    
    if (Platform.OS === 'web') {
      console.log('Fail sound would play here');
    }
  }
}

// Экспортируем готовый экземпляр
export default new SimpleAudio();