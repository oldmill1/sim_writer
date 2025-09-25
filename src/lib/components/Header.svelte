<script lang="ts">
	import { settings, typingState, updateTypingState } from '../stores';
	import type { TypingEngine } from '../utils/TypingEngine';

	interface Props {
		typingEngine: TypingEngine | undefined;
	}

	let { typingEngine }: Props = $props();

	let { isTyping, isPaused, isEditMode, isFullscreen } = $derived($typingState);
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

	function handleModeToggle(newMode: boolean) {
		if (newMode !== isEditMode) {
			if (newMode && typingEngine) {
				// Switching to edit mode - stop and restart animation
				typingEngine.restartAnimation();
			}
			updateTypingState('isEditMode', newMode);
		}
	}
</script>

<header class="header">
	<div class="header-left">
		<div class="mode-toggle">
			<button 
				class="toggle-button" 
				class:active={isEditMode}
				onclick={() => handleModeToggle(true)}
			>
				✏️
				{#if isEditMode}
					<span class="active-indicator"></span>
				{/if}
			</button>
			<button 
				class="toggle-button" 
				class:active={!isEditMode}
				onclick={() => handleModeToggle(false)}
			>
				👁️
				{#if !isEditMode}
					<span class="active-indicator"></span>
				{/if}
			</button>
		</div>
		{#if !isEditMode}
			<div class="shortcuts-hint">
				{#if !isTyping}
					Press <kbd>F</kbd> for fullscreen
				{:else}
					Press <kbd>P</kbd> to pause, <kbd>R</kbd> to restart
				{/if}
			</div>
		{/if}
	</div>
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

	.header-left {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.mode-toggle {
		display: flex;
		gap: 0.5rem;
	}

	.shortcuts-hint {
		color: #718096;
		font-size: 0.8rem;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		opacity: 0.7;
		transition: opacity 0.2s ease;
	}

	.shortcuts-hint:hover {
		opacity: 1;
	}

	.shortcuts-hint kbd {
		background: #2d3748;
		color: #e2e8f0;
		padding: 0.125rem 0.375rem;
		border-radius: 3px;
		font-size: 0.75rem;
		font-family: monospace;
		border: 1px solid #4a5568;
	}

	.toggle-button {
		background: transparent;
		color: #718096;
		border: none;
		padding: 0.75rem;
		border-radius: 50%;
		font-size: 1.2rem;
		cursor: pointer;
		transition: all 0.2s ease;
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: dropIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
		opacity: 0;
		transform: translateY(-20px) scale(0.8);
	}

	.toggle-button:nth-child(1) {
		animation-delay: 0.1s;
	}

	.toggle-button:nth-child(2) {
		animation-delay: 0.2s;
	}

	.toggle-button.active {
		color: #e2e8f0;
	}

	.toggle-button:hover:not(.active) {
		color: #e2e8f0;
		transform: scale(1.1);
	}

	.active-indicator {
		position: absolute;
		top: 8px;
		right: 8px;
		width: 8px;
		height: 8px;
		background: #a7f3d0;
		border-radius: 50%;
		animation: pulse 2s infinite;
		box-shadow: 0 0 0 0 rgba(167, 243, 208, 0.4);
	}

	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 rgba(167, 243, 208, 0.4);
		}
		70% {
			box-shadow: 0 0 0 6px rgba(167, 243, 208, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(167, 243, 208, 0);
		}
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
		animation: dropIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
		opacity: 0;
		transform: translateY(-20px) scale(0.8);
	}

	.run-button {
		animation-delay: 0.3s;
	}

	.restart-button {
		animation-delay: 0.4s;
	}

	.settings-toggle {
		animation-delay: 0.5s;
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

	@keyframes dropIn {
		0% {
			opacity: 0;
			transform: translateY(-20px) scale(0.8);
		}
		50% {
			opacity: 1;
			transform: translateY(5px) scale(1.1);
		}
		100% {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
</style>
