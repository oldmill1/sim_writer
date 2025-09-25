import { AUDIO_CONFIG } from '../constants';

export class AudioManager {
	private audio: HTMLAudioElement | null = null;
	private isEnabled = true;

	constructor() {
		this.initializeAudio();
	}

	private initializeAudio(): void {
		this.audio = new Audio(AUDIO_CONFIG.path);
		this.audio.loop = AUDIO_CONFIG.loop;
		this.audio.volume = AUDIO_CONFIG.volume;
		this.audio.preload = AUDIO_CONFIG.preload;

		// Add error handling
		this.audio.addEventListener('error', (e) => {
			console.error('Audio loading error:', e);
			console.log('Trying to load from:', AUDIO_CONFIG.path);
			console.log('Audio error details:', this.audio?.error);
		});

		this.audio.addEventListener('canplaythrough', () => {
			console.log('Audio loaded successfully');
		});

		this.audio.addEventListener('loadstart', () => {
			console.log('Audio loading started');
		});

		// Try to load the audio
		this.audio.load();
	}

	startTypingSound(): void {
		if (this.audio && this.isEnabled) {
			// Reset to beginning
			this.audio.currentTime = 0;

			// Try to play, handle autoplay restrictions
			const playPromise = this.audio.play();
			if (playPromise !== undefined) {
				playPromise.catch(error => {
					console.log('Autoplay prevented:', error);
					console.log('User interaction required to play audio');
					// Don't show error to user, just log it
				});
			}
		}
	}

	stopTypingSound(): void {
		if (this.audio) {
			this.audio.pause();
			this.audio.currentTime = 0;
		}
	}

	setEnabled(enabled: boolean): void {
		this.isEnabled = enabled;
		if (!enabled) {
			this.stopTypingSound();
		}
	}

	isSoundEnabled(): boolean {
		return this.isEnabled;
	}

	destroy(): void {
		this.stopTypingSound();
		this.audio = null;
	}
}
