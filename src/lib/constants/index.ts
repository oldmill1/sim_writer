import type { FontOption, TypingSettings } from '../types';

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

export const FACTORY_DEFAULTS: TypingSettings = {
	backgroundColor: '#0a0a0a',
	textColor: '#4a5568',
	fontSizeValue: 14,
	fontSize: '14px',
	fontFamily: AVAILABLE_FONTS[4].value, // Source Code Pro
	previewTextSize: 12,
	cursorVisible: true,
	cursorBlinkSpeed: 500,
	soundEnabled: true,
	typingSpeed: 50,
	pauseBetweenLines: 200
};

export const AUDIO_CONFIG = {
	path: '/assets/sounds/typing.mp3',
	volume: 0.3,
	loop: true,
	preload: 'auto' as const
};
