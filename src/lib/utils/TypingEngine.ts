import type { TypingState, TypingSettings } from '../types';
import { updateTypingState, typingState } from '../stores';

export class TypingEngine {
	private typingTimeout: number | null = null;

	constructor(
		private onTypingSoundStart: () => void,
		private onTypingSoundStop: () => void
	) {}

	async simulateTyping(
		sourceText: string,
		settings: TypingSettings,
		state: TypingState
	): Promise<void> {
		if (state.isTyping && !state.isPaused) {
			// PAUSE: Stop everything
			updateTypingState('isPaused', true);
			this.onTypingSoundStop();
			return;
		}

		if (state.isPaused) {
			// RESUME: Continue from where we left off
			updateTypingState('isPaused', false);
			this.onTypingSoundStart();
			await this.continueTyping(sourceText, settings, state);
			return;
		}

		// START: Begin new animation from beginning
		updateTypingState('isTyping', true);
		updateTypingState('isPaused', false);
		updateTypingState('previewText', '');
		updateTypingState('currentLineIndex', 0);
		updateTypingState('currentCharIndex', 0);

		this.onTypingSoundStart();
		await this.continueTyping(sourceText, settings, state);
	}

	private async continueTyping(sourceText: string, settings: TypingSettings, state: TypingState): Promise<void> {
		const lines = sourceText.split('\n');
		let currentPreviewText = state.previewText;
		let currentLine = state.currentLineIndex;
		let currentChar = state.currentCharIndex;

		for (let i = currentLine; i < lines.length; i++) {
			const line = lines[i];
			const startChar = i === currentLine ? currentChar : 0;

			for (let j = startChar; j < line.length; j++) {
				// Check if paused
				const currentState = await this.getCurrentState();
				if (currentState.isPaused) {
					updateTypingState('currentLineIndex', i);
					updateTypingState('currentCharIndex', j);
					await this.waitForResume();
				}

				// Check if stopped
				const stateAfterPause = await this.getCurrentState();
				if (!stateAfterPause.isTyping) break;

				currentPreviewText += line[j];
				updateTypingState('previewText', currentPreviewText);

				const randomDelay = settings.typingSpeed + Math.random() * 20 - 10;
				await this.delay(randomDelay);
			}

			// Check if stopped
			const stateAfterLine = await this.getCurrentState();
			if (!stateAfterLine.isTyping) break;

			// Add newline if not the last line
			if (i < lines.length - 1) {
				currentPreviewText += '\n';
				updateTypingState('previewText', currentPreviewText);

				const pauseTime = line.trim() === '' ? settings.pauseBetweenLines * 2 : settings.pauseBetweenLines;
				await this.delay(pauseTime);
			}
		}

		updateTypingState('isTyping', false);
		updateTypingState('isPaused', false);
		this.onTypingSoundStop();
	}

	private async getCurrentState(): Promise<TypingState> {
		return new Promise((resolve) => {
			const unsubscribe = typingState.subscribe(resolve);
			unsubscribe();
		});
	}

	private async waitForResume(): Promise<void> {
		return new Promise<void>((resolve) => {
			const checkResume = () => {
				this.getCurrentState().then(state => {
					if (!state.isPaused) {
						resolve();
					} else {
						setTimeout(checkResume, 100);
					}
				});
			};
			checkResume();
		});
	}

	private delay(ms: number): Promise<void> {
		return new Promise(resolve => {
			this.typingTimeout = setTimeout(resolve, ms);
		});
	}



	clearTimeouts(): void {
		if (this.typingTimeout) {
			clearTimeout(this.typingTimeout);
			this.typingTimeout = null;
		}
	}

	restartAnimation(): void {
		updateTypingState('previewText', '');
		updateTypingState('isTyping', false);
		updateTypingState('isPaused', false);
		updateTypingState('currentLineIndex', 0);
		updateTypingState('currentCharIndex', 0);
		this.onTypingSoundStop();
		this.clearTimeouts();
	}

	clearPreview(): void {
		updateTypingState('previewText', '');
		updateTypingState('isTyping', false);
		updateTypingState('isPaused', false);
		this.onTypingSoundStop();
		this.clearTimeouts();
	}
}
