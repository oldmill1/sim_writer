<script lang="ts">
	import { settings, typingState, updateSetting, resetSettings } from '../stores';
	import { AVAILABLE_FONTS } from '../constants';
	import type { TypingEngine } from '../utils/TypingEngine';

	interface Props {
		typingEngine: TypingEngine | undefined;
	}

	let { typingEngine }: Props = $props();

	let { settingsOpen, isTyping } = $derived($typingState);
	let { backgroundColor, textColor, fontSizeValue, fontSize, fontFamily, previewTextSize, typingSpeed, soundEnabled } = $derived($settings);

	function closeSettings() {
		typingState.update(current => ({ ...current, settingsOpen: false }));
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeSettings();
		}
	}

	function handleBackgroundColorChange(event: Event) {
		const target = event.target as HTMLInputElement;
		updateSetting('backgroundColor', target.value);
	}

	function handleTextColorChange(event: Event) {
		const target = event.target as HTMLInputElement;
		updateSetting('textColor', target.value);
	}

	function handleFontFamilyChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		updateSetting('fontFamily', target.value);
	}

	function handlePreviewTextSizeChange(event: Event) {
		const target = event.target as HTMLInputElement;
		updateSetting('previewTextSize', parseInt(target.value));
	}

	function handleTypingSpeedChange(event: Event) {
		const target = event.target as HTMLInputElement;
		updateSetting('typingSpeed', parseInt(target.value));
	}

	function handleSoundEnabledChange(event: Event) {
		const target = event.target as HTMLInputElement;
		updateSetting('soundEnabled', target.checked);
	}

	function handleResetSettings() {
		resetSettings();
	}

	function handleClearPreview() {
		if (!typingEngine) return;
		typingEngine.clearPreview();
	}
</script>

{#if settingsOpen}
	<div 
		class="settings-overlay" 
		onclick={closeSettings}
		onkeydown={handleKeydown}
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
				<button class="close-button" onclick={closeSettings}>
					✕
				</button>
			</div>
		</div>
		<div class="settings-actions">
			<button class="action-button reset-button" onclick={handleResetSettings}>
				🔄 Reset Settings
			</button>
			<button class="action-button clear-button" onclick={handleClearPreview}>
				{isTyping ? '⏹️ Stop & Clear' : '🗑️ Clear Preview'}
			</button>
		</div>
		<div class="settings-grid">
			<div class="setting">
				<label for="bg-color">Background</label>
				<input 
					type="color" 
					id="bg-color" 
					value={backgroundColor}
					onchange={handleBackgroundColorChange}
				>
			</div>
			<div class="setting">
				<label for="text-color">Text Color</label>
				<input 
					type="color" 
					id="text-color" 
					value={textColor}
					onchange={handleTextColorChange}
				>
			</div>
			<div class="setting">
				<label for="font-family">Font Family</label>
				<select 
					id="font-family" 
					value={fontFamily}
					onchange={handleFontFamilyChange}
				>
					{#each AVAILABLE_FONTS as font}
						<option value={font.value}>{font.name}</option>
					{/each}
				</select>
			</div>
			<div class="setting">
				<label for="preview-text-size">Preview Text Size</label>
				<input 
					type="range" 
					id="preview-text-size" 
					min="8" 
					max="50" 
					value={previewTextSize}
					onchange={handlePreviewTextSizeChange}
				>
				<span>{previewTextSize}px</span>
			</div>
			<div class="setting">
				<label for="typing-speed">Speed</label>
				<input 
					type="range" 
					id="typing-speed" 
					min="10" 
					max="200" 
					value={typingSpeed}
					onchange={handleTypingSpeedChange}
				>
				<span>{typingSpeed}ms</span>
			</div>
			<div class="setting">
				<label for="sound-enabled">Sound</label>
				<input 
					type="checkbox" 
					id="sound-enabled" 
					checked={soundEnabled}
					onchange={handleSoundEnabledChange}
				>
				<span>{soundEnabled ? 'ON' : 'OFF'}</span>
			</div>
		</div>
	</div>
</div>

<style>
	.settings-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.5);
		z-index: 999;
	}

	.settings-drawer {
		position: fixed;
		top: 0;
		right: -400px;
		width: 400px;
		height: 100vh;
		background: #1a1a1a;
		border-left: 1px solid #2d3748;
		transition: right 0.3s ease;
		z-index: 1000;
		box-shadow: -4px 0 16px rgba(0, 0, 0, 0.2);
	}

	.settings-drawer.open {
		right: 0;
	}

	.settings-content {
		padding: 2rem;
		height: 100%;
		overflow-y: auto;
	}

	.settings-content::-webkit-scrollbar {
		width: 6px;
	}

	.settings-content::-webkit-scrollbar-track {
		background: transparent;
	}

	.settings-content::-webkit-scrollbar-thumb {
		background: #2d3748;
		border-radius: 3px;
	}

	.settings-content::-webkit-scrollbar-thumb:hover {
		background: #4a5568;
	}

	.settings-content {
		scrollbar-width: thin;
		scrollbar-color: #2d3748 transparent;
	}

	.settings-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #2d3748;
	}

	.settings-header h4 {
		margin: 0;
		font-size: 1.2rem;
		color: #e2e8f0;
	}

	.settings-header-controls {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.settings-actions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #2d3748;
	}

	.action-button {
		background: transparent;
		color: #718096;
		border: 1px solid #2d3748;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.action-button:hover {
		color: #e2e8f0;
		border-color: #718096;
		background: rgba(255, 255, 255, 0.05);
	}

	.reset-button:hover {
		border-color: #d69e2e;
		color: #d69e2e;
	}

	.clear-button:hover {
		border-color: #718096;
		color: #718096;
	}

	.close-button {
		background: transparent;
		color: #718096;
		border: none;
		padding: 0.5rem;
		border-radius: 50%;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.2s ease;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-button:hover {
		color: #e2e8f0;
		background: rgba(255, 255, 255, 0.1);
	}

	.settings-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.setting {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.setting label {
		font-size: 0.9rem;
		color: #718096;
		font-weight: 500;
	}

	.setting input[type="color"] {
		width: 100%;
		height: 40px;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.setting input[type="range"] {
		width: 100%;
		accent-color: #4a5568;
	}

	.setting input[type="checkbox"] {
		accent-color: #4a5568;
		transform: scale(1.2);
	}

	.setting select {
		width: 100%;
		height: 40px;
		background: #1a1a1a;
		color: #e2e8f0;
		border: 1px solid #2d3748;
		border-radius: 6px;
		padding: 0.5rem 0.75rem;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.setting select:hover {
		border-color: #718096;
		background: rgba(255, 255, 255, 0.05);
	}

	.setting select:focus {
		outline: none;
		border-color: #4a5568;
		box-shadow: 0 0 0 2px rgba(74, 85, 104, 0.1);
	}

	.setting select option {
		background: #1a1a1a;
		color: #e2e8f0;
		padding: 0.5rem;
	}

	.setting span {
		font-size: 0.8rem;
		color: #4a5568;
		text-align: center;
	}
</style>
