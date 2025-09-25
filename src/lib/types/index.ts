export interface FontOption {
	name: string;
	value: string;
}

export interface TypingSettings {
	backgroundColor: string;
	textColor: string;
	fontSizeValue: number;
	fontSize: string;
	fontFamily: string;
	cursorVisible: boolean;
	cursorBlinkSpeed: number;
	soundEnabled: boolean;
	typingSpeed: number;
	pauseBetweenLines: number;
}

export interface TypingState {
	sourceText: string;
	previewText: string;
	isTyping: boolean;
	isPaused: boolean;
	currentLineIndex: number;
	currentCharIndex: number;
	isEditMode: boolean;
	settingsOpen: boolean;
}

export interface TypingRefs {
	previewElement: HTMLDivElement | null;
	cursorElement: HTMLSpanElement | null;
	cursorInterval: number | null;
	typingTimeout: number | null;
	typingAudio: HTMLAudioElement | null;
}
