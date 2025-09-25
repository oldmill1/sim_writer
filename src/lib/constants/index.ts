import type { FontOption, TypingSettings, Theme } from '../types';

export const AVAILABLE_FONTS: FontOption[] = [
	{ name: 'Bitcount Grid Double', value: '"Bitcount Grid Double", monospace' },
	{ name: 'Cascadia Code', value: '"Cascadia Code", monospace' },
	{ name: 'Fira Code', value: '"Fira Code", monospace' },
	{ name: 'M PLUS Code Latin', value: '"M PLUS Code Latin", monospace' },
	{ name: 'Source Code Pro', value: '"Source Code Pro", monospace' },
	{ name: 'Work Sans', value: '"Work Sans", sans-serif' },
	{ name: 'Monaco (Default)', value: 'Monaco, "Courier New", monospace' }
];

export const DEFAULT_SOURCE_TEXT = `{
  "manifest_version": 3,
  "name": "Hello World",
  "description": "My first extension",
  "version": "1.0",
  "action": {
    "default_popup": "popup.html"
  }
}`;

export const AVAILABLE_THEMES: Theme[] = [
	{
		id: 'default',
		name: 'Default',
		previewWindow: {
			type: 'default',
			backgroundColor: '#0a0a0a',
			textColor: '#ffffff',
			borderRadius: 8,
			boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.1)'
		}
	},
	{
		id: 'retro-term',
		name: 'Retro Term',
		previewWindow: {
			type: 'editor',
			backgroundColor: '#1e1e1e',
			textColor: '#d4d4d4',
			borderColor: '#3c3c3c',
			borderRadius: 8,
			boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
			editorTab: {
				backgroundColor: '#2d2d30',
				textColor: '#cccccc',
				fileName: 'default.txt',
				activeColor: '#007acc'
			}
		}
	}
];

export const FACTORY_DEFAULTS: TypingSettings = {
	backgroundColor: '#0a0a0a',
	textColor: '#ffffff',
	fontSizeValue: 20,
	fontSize: '20px',
	fontFamily: AVAILABLE_FONTS[4].value, // Source Code Pro
	previewTextSize: 20,
	cursorVisible: true,
	cursorBlinkSpeed: 500,
	soundEnabled: true,
	typingSpeed: 50,
	pauseBetweenLines: 200,
	currentTheme: 'default'
};

export const AUDIO_CONFIG = {
	path: '/assets/sounds/typing.mp3',
	volume: 0.3,
	loop: true,
	preload: 'auto' as const
};
