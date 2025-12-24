import { Platform, Vibration } from 'react-native';

// Простой менеджер звуков через вибрацию
export class SimpleAudio {
  private enabled: boolean = true;

  constructor() {
    this.enabled = true;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  playWelcome() {
    if (!this.enabled) return;

    console.log('🎵 Playing welcome sound');
    
    // Для всех платформ используем вибрацию
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      // Приветственная вибрация: короткая-длинная-короткая
      Vibration.vibrate([0, 100, 200, 100]);
    }
    
    // Для веба просто логируем
    if (Platform.OS === 'web') {
      console.log('Welcome sound would play here');
    }
  }

  playClick() {
    if (!this.enabled) return;
    
    console.log('🔘 Playing click sound');
    
    // Короткая вибрация для клика
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Vibration.vibrate(50);
    }
    
    // Для веба логируем
    if (Platform.OS === 'web') {
      console.log('Click sound would play here');
    }
  }

  playSuccess() {
    if (!this.enabled) return;
    
    console.log('✅ Playing success sound');
    
    // Успешная вибрация (паттерн: короткая-пауза-короткая-пауза-короткая)
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Vibration.vibrate([0, 100, 50, 100, 50, 100]);
    }
    
    // Для веба логируем
    if (Platform.OS === 'web') {
      console.log('Success sound would play here');
    }
  }

  playFail() {
    if (!this.enabled) return;
    
    console.log('❌ Playing fail sound');
    
    // Вибрация ошибки (длинная с перерывом)
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Vibration.vibrate([0, 300, 100, 300]);
    }
    
    // Для веба логируем
    if (Platform.OS === 'web') {
      console.log('Fail sound would play here');
    }
  }
}

export default new SimpleAudio();