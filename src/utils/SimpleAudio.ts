// utils/SimpleAudio.ts
import { Platform, Vibration } from 'react-native';
import Sound from 'react-native-sound';
import { Settings } from '../types/game.types';

// Устанавливаем категорию звука
Sound.setCategory('Playback');

export class SimpleAudio {
  private soundEnabled: boolean = true;
  private vibrationEnabled: boolean = true;
  private musicEnabled: boolean = true;
  
  // Объекты звуков
  private clickSound: Sound | null = null;
  private placeSound: Sound | null = null;
  private successSound: Sound | null = null;
  private gameOverSound: Sound | null = null;

  // Карта для хранения звуков
  private sounds: { [key: string]: Sound | null } = {
    clickSound: null,
    placeSound: null,
    successSound: null,
    gameOverSound: null
  };

  constructor() {
    this.initializeSounds();
  }

  private initializeSounds() {
    try {
      // Загружаем звуки
      this.loadSound('clickSound', 'click.wav');
      this.loadSound('placeSound', 'place.wav');
      this.loadSound('successSound', 'success.wav');
      this.loadSound('gameOverSound', 'lose.wav');
    } catch (error) {
      console.log('Error initializing sounds, using vibration only:', error);
    }
  }

  private loadSound(soundKey: string, filename: string) {
    try {
      const sound = new Sound(filename, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log(`Failed to load ${soundKey}:`, error);
          this.sounds[soundKey] = null;
        } else {
          console.log(`${soundKey} loaded successfully`);
        }
      });
      
      this.sounds[soundKey] = sound;
    } catch (error) {
      console.log(`Could not create sound ${soundKey}:`, error);
      this.sounds[soundKey] = null;
    }
  }

  updateSettings(settings: Settings) {
    this.soundEnabled = settings.soundEnabled;
    this.vibrationEnabled = settings.vibrationEnabled;
    this.musicEnabled = settings.musicEnabled;
  }

  private playSound(soundKey: string, volume: number = 1.0): boolean {
    if (!this.soundEnabled) return false;
    
    const sound = this.sounds[soundKey];
    if (!sound) return false;
    
    try {
      sound.setVolume(volume);
      sound.stop(() => {
        sound.play((success) => {
          if (!success) {
            console.log(`Sound ${soundKey} playback failed`);
          }
        });
      });
      return true;
    } catch (error) {
      console.log(`Error playing sound ${soundKey}:`, error);
      return false;
    }
  }

  playClick() {
    const soundPlayed = this.playSound('clickSound', 0.7);
    
    if (this.vibrationEnabled && Platform.OS !== 'web') {
      Vibration.vibrate(soundPlayed ? 10 : 50);
    }
  }

  playBlockPlace(perfect: boolean = false) {
    const soundPlayed = this.playSound('placeSound', 0.8);
    
    if (perfect) {
      setTimeout(() => {
        this.playSound('successSound', 0.6);
      }, 100);
    }
    
    if (this.vibrationEnabled && Platform.OS !== 'web') {
      if (perfect) {
        Vibration.vibrate([0, 100, 50, 100]);
      } else {
        Vibration.vibrate(soundPlayed ? 30 : 50);
      }
    }
  }

  playSuccess() {
    this.playSound('successSound', 0.8);
    
    if (this.vibrationEnabled && Platform.OS !== 'web') {
      Vibration.vibrate([0, 100, 50, 100, 50, 100]);
    }
  }

  playGameOver() {
    this.playSound('gameOverSound', 1.0);
    
    if (this.vibrationEnabled && Platform.OS !== 'web') {
      Vibration.vibrate([0, 500, 200, 500]);
    }
  }

  playFail() {
    this.playSound('gameOverSound', 0.5);
    
    if (this.vibrationEnabled && Platform.OS !== 'web') {
      Vibration.vibrate([0, 300, 100, 300]);
    }
  }

  dispose() {
    Object.values(this.sounds).forEach(sound => {
      if (sound) {
        sound.stop();
        sound.release();
      }
    });
  }
}

export default new SimpleAudio();