<script lang="ts">
	import { settings, typingState, updateSetting, updateTypingState } from '../stores';
	import { AVAILABLE_FONTS } from '../constants';
	import type { TypingEngine } from '../utils/TypingEngine';

	interface Props {
		typingEngine: TypingEngine | undefined;
	}

	let { typingEngine }: Props = $props();

	let { isEditMode } = $derived($typingState);
	let { fontFamily } = $derived($settings);

	function handleModeToggle(newMode: boolean) {
		if (newMode !== isEditMode) {
			if (newMode && typingEngine) {
				// Switching to edit mode - stop and restart animation
				typingEngine.restartAnimation();
			}
			updateTypingState('isEditMode', newMode);
		}
	}

	function handleFontChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		updateSetting('fontFamily', target.value);
	}
</script>

<div class="controls-wrapper">
	<div class="mode-toggle">
		<button 
			class="toggle-button" 
			class:active={isEditMode}
			onclick={() => handleModeToggle(true)}
		>
			Edit
		</button>
		<button 
			class="toggle-button" 
			class:active={!isEditMode}
			onclick={() => handleModeToggle(false)}
		>
			Preview
		</button>
	</div>
	<select 
		class="font-selector" 
		value={fontFamily}
		onchange={handleFontChange}
	>
		{#each AVAILABLE_FONTS as font}
			<option value={font.value}>{font.name}</option>
		{/each}
	</select>
</div>

<style>
	.controls-wrapper {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.mode-toggle {
		display: flex;
		gap: 0.5rem;
	}

	.toggle-button {
		background: transparent;
		color: #718096;
		border: 1px solid #2d3748;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.toggle-button.active {
		background: #4a5568;
		color: #0a0a0a;
		border-color: #4a5568;
	}

	.toggle-button:hover:not(.active) {
		color: #e2e8f0;
		border-color: #718096;
	}

	.font-selector {
		background: #1a1a1a;
		color: #e2e8f0;
		border: 1px solid #2d3748;
		border-radius: 6px;
		padding: 0.5rem 0.75rem;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s ease;
		min-width: 180px;
		height: 40px;
	}

	.font-selector:hover {
		border-color: #718096;
		background: rgba(255, 255, 255, 0.05);
	}

	.font-selector:focus {
		outline: none;
		border-color: #4a5568;
		box-shadow: 0 0 0 2px rgba(74, 85, 104, 0.1);
	}

	.font-selector option {
		background: #1a1a1a;
		color: #e2e8f0;
		padding: 0.5rem;
	}
</style>
