import { writable } from 'svelte/store';
import type { TypingSettings, TypingState } from '../types';
import { FACTORY_DEFAULTS, DEFAULT_SOURCE_TEXT } from '../constants';

// Settings store
export const settings = writable<TypingSettings>({ ...FACTORY_DEFAULTS });

// Typing state store
export const typingState = writable<TypingState>({
	sourceText: DEFAULT_SOURCE_TEXT,
	previewText: '',
	isTyping: false,
	isPaused: false,
	currentLineIndex: 0,
	currentCharIndex: 0,
	isEditMode: true,
	settingsOpen: false
});

// Helper functions for settings
export const updateSetting = <K extends keyof TypingSettings>(
	key: K,
	value: TypingSettings[K]
) => {
	settings.update(current => ({ ...current, [key]: value }));
};

export const resetSettings = () => {
	settings.set({ ...FACTORY_DEFAULTS });
};

// Helper functions for typing state
export const updateTypingState = <K extends keyof TypingState>(
	key: K,
	value: TypingState[K]
) => {
	typingState.update(current => ({ ...current, [key]: value }));
};

export const resetTypingState = () => {
	typingState.update(current => ({
		...current,
		previewText: '',
		isTyping: false,
		isPaused: false,
		currentLineIndex: 0,
		currentCharIndex: 0
	}));
};
