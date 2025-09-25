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
	let isPaused = false;
	let typingSpeed = 50; // milliseconds per character
	let pauseBetweenLines = 200; // milliseconds
	let settingsOpen = false;
	let typingTimeout: number;
	let currentLineIndex = 0;
	let currentCharIndex = 0;
	
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
		if (isTyping && !isPaused) {
			// PAUSE: Stop everything
			isPaused = true;
			stopTypingSound();
			return;
		}
		
		if (isPaused) {
			// RESUME: Continue from where we left off
			isPaused = false;
			startTypingSound();
			return;
		}
		
		// START: Begin new animation from beginning
		isTyping = true;
		isPaused = false;
		previewText = '';
		currentLineIndex = 0;
		currentCharIndex = 0;
		
		startCursorBlinking();
		startTypingSound();
		
		const lines = sourceText.split('\n');
		
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			
			for (let j = 0; j < line.length; j++) {
				// Check if paused
				if (isPaused) {
					currentLineIndex = i;
					currentCharIndex = j;
					await waitForResume();
				}
				
				// Check if stopped
				if (!isTyping) break;
				
				previewText += line[j];
				
				const randomDelay = typingSpeed + Math.random() * 20 - 10;
				await new Promise(resolve => {
					typingTimeout = setTimeout(resolve, randomDelay);
				});
			}
			
			// Check if stopped
			if (!isTyping) break;
			
			// Add newline if not the last line
			if (i < lines.length - 1) {
				previewText += '\n';
				
				const pauseTime = line.trim() === '' ? pauseBetweenLines * 2 : pauseBetweenLines;
				await new Promise(resolve => {
					typingTimeout = setTimeout(resolve, pauseTime);
				});
			}
		}
		
		isTyping = false;
		isPaused = false;
		stopCursorBlinking();
		stopTypingSound();
	}
	
	// Wait for resume when paused
	async function waitForResume() {
		return new Promise<void>((resolve) => {
			const checkResume = () => {
				if (!isPaused) {
					resolve();
				} else {
					setTimeout(checkResume, 100);
				}
			};
			checkResume();
		});
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
			// Reset to beginning
			typingAudio.currentTime = 0;
			
			// Try to play, handle autoplay restrictions
			const playPromise = typingAudio.play();
			if (playPromise !== undefined) {
				playPromise.catch(error => {
					console.log('Autoplay prevented:', error);
					console.log('User interaction required to play audio');
					// Don't show error to user, just log it
				});
			}
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
		isPaused = false;
		stopCursorBlinking();
		stopTypingSound();
		
		// Clear any pending timeouts
		if (typingTimeout) {
			clearTimeout(typingTimeout);
		}
	}
	
	function restartAnimation() {
		// STOP everything and reset to beginning
		previewText = '';
		isTyping = false;
		isPaused = false;
		currentLineIndex = 0;
		currentCharIndex = 0;
		stopCursorBlinking();
		stopTypingSound();
		
		// Clear any pending timeouts
		if (typingTimeout) {
			clearTimeout(typingTimeout);
		}
	}
	
	onMount(() => {
		// Initialize audio - use path from static folder
		typingAudio = new Audio('/assets/sounds/typing.mp3');
		typingAudio.loop = true;
		typingAudio.volume = 0.3; // Set a reasonable volume
		typingAudio.preload = 'auto';
		
		// Add error handling
		typingAudio.addEventListener('error', (e) => {
			console.error('Audio loading error:', e);
			console.log('Trying to load from: /assets/sounds/typing.mp3');
			console.log('Audio error details:', typingAudio.error);
		});
		
		typingAudio.addEventListener('canplaythrough', () => {
			console.log('Audio loaded successfully');
		});
		
		typingAudio.addEventListener('loadstart', () => {
			console.log('Audio loading started');
		});
		
		// Try to load the audio
		typingAudio.load();
		
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
			>
				{isTyping ? (isPaused ? '▶️' : '⏸️') : '🚀'}
			</button>
			<button 
				class="restart-button" 
				onclick={restartAnimation}
			>
				🔄
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
