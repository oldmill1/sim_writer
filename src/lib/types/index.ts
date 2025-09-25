export interface FontOption {
	name: string;
	value: string;
}

export interface Theme {
	id: string;
	name: string;
	previewWindow: {
		type: 'default' | 'terminal' | 'editor';
		backgroundColor: string;
		textColor: string;
		borderColor?: string;
		borderRadius?: number;
		boxShadow?: string;
		editorTab?: {
			backgroundColor: string;
			textColor: string;
			fileName: string;
			activeColor?: string;
		};
		terminalBar?: {
			backgroundColor: string;
			textColor: string;
			buttons?: Array<{
				color: string;
				size: number;
			}>;
		};
	};
}

export interface TypingSettings {
	backgroundColor: string;
	textColor: string;
	fontSizeValue: number;
	fontSize: string;
	fontFamily: string;
	previewTextSize: number;
	cursorVisible: boolean;
	cursorBlinkSpeed: number;
	soundEnabled: boolean;
	typingSpeed: number;
	pauseBetweenLines: number;
	currentTheme: string;
}

export interface TypingState {
	title: string;
	sourceText: string;
	previewText: string;
	isTyping: boolean;
	isPaused: boolean;
	currentLineIndex: number;
	currentCharIndex: number;
	isEditMode: boolean;
	settingsOpen: boolean;
	isFullscreen: boolean;
}

export interface TypingRefs {
	previewElement: HTMLDivElement | null;
	cursorElement: HTMLSpanElement | null;
	cursorInterval: number | null;
	typingTimeout: number | null;
	typingAudio: HTMLAudioElement | null;
}
