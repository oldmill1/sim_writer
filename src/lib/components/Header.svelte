<script lang="ts">
	import { settings, typingState } from '../stores';
	import type { TypingEngine } from '../utils/TypingEngine';

	interface Props {
		typingEngine: TypingEngine | undefined;
	}

	let { typingEngine }: Props = $props();

	let { isTyping, isPaused } = $derived($typingState);
	let { soundEnabled } = $derived($settings);

	function handleSimulateTyping() {
		if (!typingEngine) return;
		const state = $typingState;
		const settingsValue = $settings;
		
		// If in edit mode, automatically switch to preview mode
		if (state.isEditMode) {
			typingState.update(current => ({ ...current, isEditMode: false }));
		}
		
		// Don't await - let it run in background
		typingEngine.simulateTyping(state.sourceText, settingsValue, state);
	}

	function handleRestartAnimation() {
		if (!typingEngine) return;
		typingEngine.restartAnimation();
	}

	function toggleSettings() {
		typingState.update(current => ({ ...current, settingsOpen: !current.settingsOpen }));
	}
</script>

<header class="header">
	<div class="logo"></div>
	<div class="header-controls">
		<button 
			class="run-button" 
			onclick={handleSimulateTyping}
		>
			{isTyping ? (isPaused ? '▶️' : '⏸️') : '🚀'}
		</button>
		<button 
			class="restart-button" 
			onclick={handleRestartAnimation}
		>
			🔄
		</button>
		<button 
			class="settings-toggle" 
			onclick={toggleSettings}
		>
			⚙️
		</button>
	</div>
</header>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		background: transparent;
	}

	.logo {
		flex: 1;
	}

	.header-controls {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.run-button, .settings-toggle, .restart-button {
		background: transparent;
		color: #718096;
		border: none;
		padding: 0.75rem;
		border-radius: 50%;
		font-weight: 600;
		font-size: 1.2rem;
		cursor: pointer;
		transition: all 0.2s ease;
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.run-button:hover:not(:disabled), 
	.settings-toggle:hover:not(:disabled), 
	.restart-button:hover:not(:disabled) {
		color: #e2e8f0;
		transform: scale(1.1);
	}

	.run-button:disabled, 
	.settings-toggle:disabled, 
	.restart-button:disabled {
		background: transparent;
		color: #4a5568;
		cursor: not-allowed;
		transform: none;
	}
</style>
