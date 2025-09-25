<script lang="ts">
	import { onMount } from 'svelte';
	import { settings, typingState, updateTypingState } from '../stores';
	import { TypingEngine } from '../utils/TypingEngine';
	import { AudioManager } from '../utils/AudioManager';
	import Header from './Header.svelte';
	import ContentArea from './ContentArea.svelte';
	import SettingsDrawer from './SettingsDrawer.svelte';
	import './TypingSimulator.scss';

	let typingEngine = $state<TypingEngine | undefined>();
	let audioManager = $state<AudioManager | undefined>();
	let cursorElement = $state<HTMLSpanElement | undefined>();

	// Initialize managers
	onMount(() => {
		audioManager = new AudioManager();
		
		typingEngine = new TypingEngine(
			() => {
				// Typing sound start handler
				audioManager?.startTypingSound();
			},
			() => {
				// Typing sound stop handler
				audioManager?.stopTypingSound();
			}
		);

		// Sync audio manager with settings
		const unsubscribeSettings = settings.subscribe((currentSettings: any) => {
			audioManager?.setEnabled(currentSettings.soundEnabled);
		});

		// Keyboard event listener for shortcuts
		function handleKeydown(event: KeyboardEvent) {
			// Only work in preview mode
			if (!$typingState.isEditMode) {
				const key = event.key.toLowerCase();
				
				switch (key) {
					case 'f':
						// Fullscreen shortcut - only when not typing
						if (!$typingState.isTyping) {
							event.preventDefault();
							toggleFullscreen();
						}
						break;
					case 'r':
						// Restart shortcut
						event.preventDefault();
						if (typingEngine) {
							typingEngine.restartAnimation();
						}
						break;
					case 'p':
						// Play/Pause shortcut
						event.preventDefault();
						if (typingEngine) {
							const state = $typingState;
							const settingsValue = $settings;
							
							// Use simulateTyping for play/pause functionality
							typingEngine.simulateTyping(state.sourceText, settingsValue, state);
						}
						break;
				}
			}
		}

		document.addEventListener('keydown', handleKeydown);

		return () => {
			unsubscribeSettings();
			audioManager?.destroy();
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	// Fullscreen functionality
	async function toggleFullscreen() {
		if (!document.fullscreenElement) {
			// Enter fullscreen
			try {
				await document.documentElement.requestFullscreen();
				updateTypingState('isFullscreen', true);
				
				// Start typing animation after entering fullscreen
				if (typingEngine) {
					const state = $typingState;
					const settingsValue = $settings;
					typingEngine.simulateTyping(state.sourceText, settingsValue, state);
				}
			} catch (error) {
				console.error('Error entering fullscreen:', error);
			}
		} else {
			// Exit fullscreen
			try {
				await document.exitFullscreen();
				updateTypingState('isFullscreen', false);
			} catch (error) {
				console.error('Error exiting fullscreen:', error);
			}
		}
	}

	// Listen for fullscreen changes
	onMount(() => {
		function handleFullscreenChange() {
			updateTypingState('isFullscreen', !!document.fullscreenElement);
		}

		document.addEventListener('fullscreenchange', handleFullscreenChange);
		
		return () => {
			document.removeEventListener('fullscreenchange', handleFullscreenChange);
		};
	});

	// Reactive cursor blinking
	let cursorInterval: number | null = null;
	
	$effect(() => {
		if (cursorElement && $typingState.isTyping && !$typingState.isPaused) {
			// Start cursor blinking
			cursorInterval = setInterval(() => {
				if (cursorElement) {
					cursorElement.style.opacity = cursorElement.style.opacity === '0' ? '1' : '0';
				}
			}, $settings.cursorBlinkSpeed);
		} else {
			// Stop cursor blinking
			if (cursorInterval) {
				clearInterval(cursorInterval);
				cursorInterval = null;
			}
			if (cursorElement) {
				cursorElement.style.opacity = '1';
			}
		}
		
		return () => {
			if (cursorInterval) {
				clearInterval(cursorInterval);
				cursorInterval = null;
			}
		};
	});
</script>

<div class="container" class:fullscreen={$typingState.isFullscreen}>
	{#if typingEngine}
		{#if !$typingState.isFullscreen}
			<Header {typingEngine} />
		{/if}
		
		<div class="main-content">
			<ContentArea bind:cursorElement />
		</div>
		
		{#if !$typingState.isFullscreen}
			<SettingsDrawer {typingEngine} />
		{/if}
	{/if}
</div>

<style>
	.container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: #0a0a0a;
		color: #e2e8f0;
		font-family: 'SF Pro Display', 'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	.container.fullscreen {
		height: 100vh;
		width: 100vw;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;
	}

	.main-content {
		flex: 1;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.container.fullscreen .main-content {
		padding: 2rem;
		height: calc(100vh - 4rem);
	}

	@media (max-width: 768px) {
		.main-content {
			padding: 1rem;
		}
		
		.container.fullscreen .main-content {
			padding: 1rem;
			height: calc(100vh - 2rem);
		}
	}
</style>