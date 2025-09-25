<script lang="ts">
	import { onMount } from 'svelte';
	import './TypingSimulator.scss';
	
	// State
	let sourceText = `{
  "manifest_version": 3,
  "name": "Hello World",
  "description": "My first extension",
  "version": "1.0",
  "action": {
    "default_popup": "popup.html"
  }
}`;
	
	let previewText = '';
	let isTyping = false;
	let typingSpeed = 50; // milliseconds per character
	let pauseBetweenLines = 200; // milliseconds
	let settingsOpen = false;
	
	// Environment settings
	let backgroundColor = '#0a0a0a';
	let textColor = '#4a5568';
	let fontSizeValue = 14;
	let fontSize = '14px';
	let fontFamily = 'Monaco, "Courier New", monospace';
	let cursorVisible = true;
	let cursorBlinkSpeed = 500;
	let soundEnabled = true;
	
	// Factory default settings
	const factoryDefaults = {
		backgroundColor: '#0a0a0a',
		textColor: '#4a5568',
		fontSizeValue: 14,
		fontSize: '14px',
		fontFamily: 'Monaco, "Courier New", monospace',
		cursorVisible: true,
		cursorBlinkSpeed: 500,
		soundEnabled: true,
		typingSpeed: 50,
		pauseBetweenLines: 200
	};
	
	// Reactive statement to update fontSize
	$: fontSize = fontSizeValue + 'px';
	
	// Refs
	let previewElement: HTMLDivElement;
	let cursorElement: HTMLSpanElement;
	let cursorInterval: number;
	let typingAudio: HTMLAudioElement;
	
	// Typing simulation
	async function simulateTyping() {
		if (isTyping) return;
		
		isTyping = true;
		previewText = '';
		
		// Start cursor blinking
		startCursorBlinking();
		
		// Start typing sound
		startTypingSound();
		
		const lines = sourceText.split('\n');
		let totalCharacters = 0;
		
		// Calculate total characters for sound timing
		for (const line of lines) {
			totalCharacters += line.length;
		}
		
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			
			// Type each character in the line
			for (let j = 0; j < line.length; j++) {
				previewText += line[j];
				
				// Add some randomness to typing speed
				const randomDelay = typingSpeed + Math.random() * 20 - 10;
				await new Promise(resolve => setTimeout(resolve, randomDelay));
			}
			
			// Add newline if not the last line
			if (i < lines.length - 1) {
				previewText += '\n';
				
				// Pause between lines (longer pause for empty lines)
				const pauseTime = line.trim() === '' ? pauseBetweenLines * 2 : pauseBetweenLines;
				await new Promise(resolve => setTimeout(resolve, pauseTime));
			}
		}
		
		isTyping = false;
		stopCursorBlinking();
		stopTypingSound();
	}
	
	function startCursorBlinking() {
		cursorInterval = setInterval(() => {
			if (cursorElement) {
				cursorElement.style.opacity = cursorElement.style.opacity === '0' ? '1' : '0';
			}
		}, cursorBlinkSpeed);
	}
	
	function stopCursorBlinking() {
		if (cursorInterval) {
			clearInterval(cursorInterval);
			if (cursorElement) {
				cursorElement.style.opacity = '1';
			}
		}
	}
	
	function startTypingSound() {
		if (typingAudio && soundEnabled) {
			typingAudio.currentTime = 0;
			typingAudio.play().catch(console.error);
		}
	}
	
	function stopTypingSound() {
		if (typingAudio) {
			typingAudio.pause();
			typingAudio.currentTime = 0;
		}
	}
	
	function resetToFactoryDefaults() {
		backgroundColor = factoryDefaults.backgroundColor;
		textColor = factoryDefaults.textColor;
		fontSizeValue = factoryDefaults.fontSizeValue;
		fontSize = factoryDefaults.fontSize;
		fontFamily = factoryDefaults.fontFamily;
		cursorVisible = factoryDefaults.cursorVisible;
		cursorBlinkSpeed = factoryDefaults.cursorBlinkSpeed;
		soundEnabled = factoryDefaults.soundEnabled;
		typingSpeed = factoryDefaults.typingSpeed;
		pauseBetweenLines = factoryDefaults.pauseBetweenLines;
	}
	
	function clearPreview() {
		previewText = '';
		isTyping = false;
		stopCursorBlinking();
		stopTypingSound();
	}
	
	onMount(() => {
		// Initialize audio - use relative path from public folder
		typingAudio = new Audio('/assets/sounds/typing.mp3');
		typingAudio.loop = true;
		typingAudio.volume = 0.3; // Set a reasonable volume
		
		// Add error handling
		typingAudio.addEventListener('error', (e) => {
			console.error('Audio loading error:', e);
			console.log('Trying to load from: /assets/sounds/typing.mp3');
		});
		
		typingAudio.addEventListener('canplaythrough', () => {
			console.log('Audio loaded successfully');
		});
		
		return () => {
			stopCursorBlinking();
			stopTypingSound();
		};
	});
</script>

<div class="container">
	<!-- Header -->
	<header class="header">
		<div class="logo"></div>
		<div class="header-controls">
			<button 
				class="run-button" 
				onclick={simulateTyping}
				disabled={isTyping}
			>
				{isTyping ? '⏸️' : '🚀'}
			</button>
			<button 
				class="settings-toggle" 
				onclick={() => settingsOpen = !settingsOpen}
			>
				⚙️
			</button>
		</div>
	</header>
	
	<!-- Main Content -->
	<div class="main-content">
		<div class="panels">
			<!-- Source Panel -->
			<div class="panel source-panel">
				<div class="panel-content">
					<textarea 
						bind:value={sourceText}
						placeholder="Enter your code here..."
						class="source-textarea"
					></textarea>
				</div>
			</div>
			
			<!-- Preview Panel -->
			<div class="panel preview-panel">
				<div class="panel-content">
					<div 
						bind:this={previewElement}
						class="preview-screen"
						style="background-color: {backgroundColor}; color: {textColor}; font-size: {fontSize}; font-family: {fontFamily};"
					>
						<pre class="preview-text">{previewText}<span bind:this={cursorElement} class="cursor">|</span></pre>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Settings Drawer -->
	{#if settingsOpen}
		<div 
			class="settings-overlay" 
			onclick={() => settingsOpen = false}
			onkeydown={(e) => e.key === 'Escape' && (settingsOpen = false)}
			role="button"
			tabindex="0"
			aria-label="Close settings"
		></div>
	{/if}
	<div class="settings-drawer" class:open={settingsOpen}>
		<div class="settings-content">
			<div class="settings-header">
				<h4>Settings</h4>
				<div class="settings-header-controls">
					<button class="close-button" onclick={() => settingsOpen = false}>
						✕
					</button>
				</div>
			</div>
			<div class="settings-actions">
				<button class="action-button reset-button" onclick={resetToFactoryDefaults}>
					🔄 Reset Settings
				</button>
				<button class="action-button clear-button" onclick={clearPreview}>
					{isTyping ? '⏹️ Stop & Clear' : '🗑️ Clear Preview'}
				</button>
			</div>
			<div class="settings-grid">
				<div class="setting">
					<label for="bg-color">Background</label>
					<input type="color" id="bg-color" bind:value={backgroundColor}>
				</div>
				<div class="setting">
					<label for="text-color">Text Color</label>
					<input type="color" id="text-color" bind:value={textColor}>
				</div>
				<div class="setting">
					<label for="font-size">Font Size</label>
					<input type="range" id="font-size" min="10" max="24" bind:value={fontSizeValue}>
					<span>{fontSize}</span>
				</div>
				<div class="setting">
					<label for="typing-speed">Speed</label>
					<input type="range" id="typing-speed" min="10" max="200" bind:value={typingSpeed}>
					<span>{typingSpeed}ms</span>
				</div>
				<div class="setting">
					<label for="sound-enabled">Sound</label>
					<input type="checkbox" id="sound-enabled" bind:checked={soundEnabled}>
					<span>{soundEnabled ? 'ON' : 'OFF'}</span>
				</div>
			</div>
		</div>
	</div>
</div>
