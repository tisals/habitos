export class AudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;

  play(audioPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.stop();
        
        this.currentAudio = new Audio(audioPath);
        this.currentAudio.addEventListener('ended', () => {
          this.isPlaying = false;
          resolve();
        });
        this.currentAudio.addEventListener('error', (error) => {
          console.error('Error playing audio:', error);
          reject(error);
        });

        this.currentAudio.play()
          .then(() => {
            this.isPlaying = true;
          })
          .catch((error) => {
            console.error('Audio playback failed:', error);
            reject(error);
          });
      } catch (error) {
        console.error('Error initializing audio:', error);
        reject(error);
      }
    });
  }

  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
      this.isPlaying = false;
    }
  }

  pause(): void {
    if (this.currentAudio && this.isPlaying) {
      this.currentAudio.pause();
      this.isPlaying = false;
    }
  }

  resume(): void {
    if (this.currentAudio && !this.isPlaying) {
      this.currentAudio.play()
        .then(() => {
          this.isPlaying = true;
        })
        .catch((error) => {
          console.error('Error resuming audio:', error);
        });
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  preload(audioPath: string): void {
    const audio = new Audio(audioPath);
    audio.preload = 'auto';
  }
}

export const audioService = new AudioService();
