// utils/SimpleAudio.ts
import { Platform, Vibration } from 'react-native';
import Sound from 'react-native-sound';
import SoundPlayer from 'react-native-sound-player';
import { Settings } from '../types/game.types';

Sound.setCategory('Playback');

export class SimpleAudio {
  private soundEnabled: boolean = true;
  private vibrationEnabled: boolean = true;
  private musicEnabled: boolean = true;
  
  private clickSound: Sound | null = null;
  private placeSound: Sound | null = null;
  private successSound: Sound | null = null;
  private gameOverSound: Sound | null = null;
  
  private isMusicPlaying: boolean = false;
  private musicLoaded: boolean = false;

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
      if (Platform.OS !== 'web') {
        this.loadSound('clickSound', 'click.wav');
        this.loadSound('placeSound', 'place.wav');
        this.loadSound('successSound', 'success.wav');
        this.loadSound('gameOverSound', 'lose.wav');
      }
    } catch (error) {
      console.log('Error initializing sounds:', error);
    }
  }

  private loadSound(soundKey: string, filename: string) {
    try {
      const sound = new Sound(filename, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log(`Failed to load ${soundKey}:`, error);
          this.sounds[soundKey] = null;
        }
      });
      this.sounds[soundKey] = sound;
    } catch (error) {
      console.log(`Could not create sound ${soundKey}:`, error);
      this.sounds[soundKey] = null;
    }
  }

  updateSettings(settings: Settings) {
    const oldMusicEnabled = this.musicEnabled;
    this.soundEnabled = settings.soundEnabled;
    this.vibrationEnabled = settings.vibrationEnabled;
    this.musicEnabled = settings.musicEnabled;
    
    console.log('Audio settings updated:', {
      soundEnabled: this.soundEnabled,
      vibrationEnabled: this.vibrationEnabled,
      musicEnabled: this.musicEnabled
    });

    // Управление музыкой
    if (oldMusicEnabled !== this.musicEnabled) {
      if (this.musicEnabled) {
        if (this.isMusicPlaying) {
          this.resumeBackgroundMusic();
        }
      } else {
        this.pauseBackgroundMusic();
      }
    }
  }

  // Фоновая музыка
  playBackgroundMusic() {
    if (!this.musicEnabled || this.isMusicPlaying) return;

    try {
      // Загружаем музыку (делаем это при первом запуске)
      if (!this.musicLoaded) {
        // Для iOS нужен путь к файлу в bundle
        if (Platform.OS === 'ios') {
          SoundPlayer.loadSoundFile('soundtrack', 'mp3');
        } else {
          // Для Android
          SoundPlayer.loadSoundFile('soundtrack', 'mp3');
        }
        this.musicLoaded = true;
      }

      SoundPlayer.play();
      SoundPlayer.setNumberOfLoops(-1); // Бесконечный цикл
      SoundPlayer.setVolume(0.3); // 30% громкости
      
      this.isMusicPlaying = true;
      console.log('Background music started');
    } catch (error) {
      console.log('Error playing background music:', error);
    }
  }

  pauseBackgroundMusic() {
    if (!this.isMusicPlaying) return;

    try {
      SoundPlayer.pause();
      this.isMusicPlaying = false;
      console.log('Background music paused');
    } catch (error) {
      console.log('Error pausing background music:', error);
    }
  }

  resumeBackgroundMusic() {
    if (!this.musicEnabled || this.isMusicPlaying) return;

    try {
      SoundPlayer.resume();
      this.isMusicPlaying = true;
      console.log('Background music resumed');
    } catch (error) {
      console.log('Error resuming background music:', error);
    }
  }

  stopBackgroundMusic() {
    try {
      SoundPlayer.stop();
      this.isMusicPlaying = false;
      console.log('Background music stopped');
    } catch (error) {
      console.log('Error stopping background music:', error);
    }
  }

  private playSound(soundKey: string, volume: number = 1.0): boolean {
    if (!this.soundEnabled) return false;
    
    const sound = this.sounds[soundKey];
    if (!sound) return false;
    
    try {
      sound.setVolume(volume);
      sound.stop(() => {
        sound.play();
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
    // Останавливаем музыку
    this.stopBackgroundMusic();
    
    // Очищаем звуковые эффекты
    Object.values(this.sounds).forEach(sound => {
      if (sound) {
        sound.stop();
        sound.release();
      }
    });
  }
}

export default new SimpleAudio();