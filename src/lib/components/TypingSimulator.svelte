<script lang="ts">
	import { onMount } from 'svelte';
	import { settings, typingState } from '../stores';
	import { TypingEngine } from '../utils/TypingEngine';
	import { AudioManager } from '../utils/AudioManager';
	import Header from './Header.svelte';
	import ControlsWrapper from './ControlsWrapper.svelte';
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

		return () => {
			unsubscribeSettings();
			audioManager?.destroy();
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

<div class="container">
	{#if typingEngine}
		<Header {typingEngine} />
		
		<div class="main-content">
			<ControlsWrapper {typingEngine} />
			<ContentArea bind:cursorElement />
		</div>
		
		<SettingsDrawer {typingEngine} />
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

	.main-content {
		flex: 1;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	@media (max-width: 768px) {
		.main-content {
			padding: 1rem;
		}
	}
</style>