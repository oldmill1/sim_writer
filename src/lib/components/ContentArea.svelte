<script lang="ts">
	import { settings, typingState, updateTypingState, currentTheme } from '../stores';
	import Prism from 'prismjs';
	import 'prismjs/components/prism-json';

	interface Props {
		cursorElement: HTMLSpanElement | undefined;
	}

	let { cursorElement = $bindable() }: Props = $props();

	let { isEditMode, sourceText, previewText } = $derived($typingState);
	let { backgroundColor, textColor, fontSize, fontFamily, previewTextSize } = $derived($settings);
	let theme = $derived($currentTheme);

	let previewElement = $state<HTMLDivElement>();
	let textareaElement = $state<HTMLTextAreaElement>();

	function handleSourceTextChange(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		updateTypingState('sourceText', target.value);
	}

	function handleCursorRef(element: HTMLSpanElement) {
		cursorElement = element;
	}

	// Prism.js syntax highlighting function
	function highlightWithPrism(text: string): string {
		if (!text) return '';
		
		// Use Prism.js to highlight JSON
		const highlighted = Prism.highlight(text, Prism.languages.json, 'json');
		return highlighted;
	}
</script>

<div class="content-area">
	<!-- Edit Mode -->
	{#if isEditMode}
		<textarea 
			bind:this={textareaElement}
			bind:value={sourceText}
			placeholder="Enter your code here..."
			class="source-textarea"
			style="font-family: {fontFamily}; font-size: {fontSize};"
		></textarea>
	{:else}
		<!-- Preview Mode -->
		{#if theme.previewWindow.type === 'editor'}
			<!-- Editor Theme -->
			<div 
				bind:this={previewElement}
				class="preview-screen editor-theme aqua-editor"
				style="
					color: {theme.previewWindow.textColor}; 
					font-size: {previewTextSize}px; 
					font-family: {fontFamily};
				"
			>
		{#if theme.previewWindow.editorTab}
			<div class="editor-tab aqua-tab">
				<div class="traffic-lights">
					<div class="traffic-light close"></div>
					<div class="traffic-light minimize"></div>
					<div class="traffic-light maximize"></div>
				</div>
				<span class="tab-filename">{theme.previewWindow.editorTab.fileName}</span>
				<div class="tab-spacer"></div>
			</div>
		{/if}
				<div class="preview-text aqua-content">
					{#if theme.id === 'retro-term'}
						{@html highlightWithPrism(previewText)}
					{:else}
						{previewText}
					{/if}
					<span bind:this={cursorElement} class="cursor">|</span>
				</div>
			</div>
		{:else if theme.previewWindow.type === 'terminal'}
			<!-- Terminal Theme -->
			<div 
				bind:this={previewElement}
				class="preview-screen terminal-theme"
				style="
					background-color: {theme.previewWindow.backgroundColor}; 
					color: {theme.previewWindow.textColor}; 
					font-size: {previewTextSize}px; 
					font-family: {fontFamily};
					border: 1px solid {theme.previewWindow.borderColor || 'transparent'};
					border-radius: {theme.previewWindow.borderRadius || 0}px;
					box-shadow: {theme.previewWindow.boxShadow || 'none'};
				"
			>
				{#if theme.previewWindow.terminalBar}
					<div class="terminal-bar" style="background-color: {theme.previewWindow.terminalBar.backgroundColor}; color: {theme.previewWindow.terminalBar.textColor};">
						<div class="terminal-buttons">
							{#if theme.previewWindow.terminalBar.buttons}
								{#each theme.previewWindow.terminalBar.buttons as button}
									<div class="terminal-button" style="background-color: {button.color}; width: {button.size}px; height: {button.size}px;"></div>
								{/each}
							{/if}
						</div>
						<div class="terminal-title">Terminal</div>
					</div>
				{/if}
				<div class="preview-text">
					{previewText}
					<span bind:this={cursorElement} class="cursor">|</span>
				</div>
			</div>
		{:else}
			<!-- Default Theme -->
			<div 
				bind:this={previewElement}
				class="preview-screen default-theme"
				style="
					background-color: {theme.previewWindow.backgroundColor}; 
					color: {theme.previewWindow.textColor}; 
					font-size: {previewTextSize}px; 
					font-family: {fontFamily};
					border-radius: {theme.previewWindow.borderRadius || 0}px;
					box-shadow: {theme.previewWindow.boxShadow || 'none'};
				"
			>
				<div class="preview-text">
					{previewText}
					<span bind:this={cursorElement} class="cursor">|</span>
				</div>
			</div>
		{/if}
	{/if}
</div>

<style>
	.content-area {
		flex: 1;
		position: relative;
	}

	.source-textarea {
		width: 100%;
		height: 100%;
		background: #0a0a0a;
		border: 1px solid #2d3748;
		border-radius: 8px;
		padding: 1rem;
		color: #e2e8f0;
		font-family: 'Monaco', 'Courier New', monospace;
		line-height: 1.5;
		resize: none;
		outline: none;
		transition: border-color 0.2s ease;
	}

	.source-textarea:focus {
		border-color: #4a5568;
		box-shadow: 0 0 0 2px rgba(203, 166, 247, 0.1);
	}

	.preview-screen {
		width: 100%;
		height: 100%;
		border-radius: 8px;
		overflow: auto;
		position: relative;
		box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	/* Editor Theme Styles - Classic Mac OS X Aqua Window */
	.editor-theme {
		display: flex;
		flex-direction: column;
		border: 1px solid #8e8e8e;
		border-radius: 12px;
		box-shadow: 
			0 4px 20px rgba(0, 0, 0, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		background: #ffffff;
		overflow: hidden;
		position: relative;
	}

	.editor-tab {
		display: flex;
		align-items: center;
		padding: 8px 12px;
		background: linear-gradient(to bottom, #e0e0e0 0%, #d0d0d0 100%);
		border-bottom: 1px solid #b0b0b0;
		font-size: 12px;
		font-weight: 600;
		min-height: 28px;
		position: relative;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
	}

	.editor-tab::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.9) 50%, transparent 100%);
	}

	.traffic-lights {
		display: flex;
		gap: 6px;
		margin-right: 12px;
	}

	.traffic-light {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		cursor: pointer;
		transition: all 0.15s ease;
		position: relative;
		box-shadow: 
			inset 0 1px 0 rgba(255, 255, 255, 0.4),
			0 1px 2px rgba(0, 0, 0, 0.2);
	}

	.traffic-light.close {
		background: radial-gradient(circle at 30% 30%, #ff5f56, #ff3b30);
		border: 1px solid #d32f2f;
	}

	.traffic-light.close::before {
		content: '×';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: #000000;
		font-size: 7px;
		font-weight: bold;
		opacity: 0.6;
		text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
	}

	.traffic-light.minimize {
		background: radial-gradient(circle at 30% 30%, #ffbd2e, #ffa500);
		border: 1px solid #e6a700;
	}

	.traffic-light.minimize::before {
		content: '−';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: #000000;
		font-size: 8px;
		font-weight: bold;
		opacity: 0.6;
		text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
	}

	.traffic-light.maximize {
		background: radial-gradient(circle at 30% 30%, #28ca42, #20a035);
		border: 1px solid #1e8b2e;
	}

	.traffic-light.maximize::before {
		content: '+';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: #000000;
		font-size: 7px;
		font-weight: bold;
		opacity: 0.6;
		text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
	}

	.traffic-light:hover {
		transform: scale(1.05);
		box-shadow: 
			inset 0 1px 0 rgba(255, 255, 255, 0.4),
			0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.traffic-light:hover::before {
		opacity: 0.8;
	}

	.traffic-light:active {
		transform: scale(0.95);
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
	}

	.tab-filename {
		color: #000000;
		font-family: 'Lucida Grande', 'Helvetica Neue', Helvetica, Arial, sans-serif;
		text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
		font-weight: 600;
		flex: 1;
		text-align: center;
	}

	.tab-spacer {
		width: 60px; /* Same width as traffic lights to center the title */
	}

	.editor-theme .preview-text {
		flex: 1;
		padding: 24px 32px !important;
		position: relative;
		background: linear-gradient(to bottom, #ffffff 0%, #fafafa 100%);
		font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
		line-height: 1.5;
		color: #000000;
		margin: 0 !important;
	}

	/* Aqua-specific styling */
	.aqua-editor {
		background: #ffffff !important;
		border: 1px solid #8e8e8e !important;
		border-radius: 12px !important;
		box-shadow: 
			0 4px 20px rgba(0, 0, 0, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.8) !important;
	}

	.aqua-tab {
		background: linear-gradient(to bottom, #e0e0e0 0%, #d0d0d0 100%) !important;
		border-bottom: 1px solid #b0b0b0 !important;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6) !important;
	}

	.aqua-content {
		background: linear-gradient(to bottom, #ffffff 0%, #fafafa 100%) !important;
		font-family: 'Monaco', 'Menlo', 'Courier New', monospace !important;
		line-height: 1.5 !important;
		padding: 24px 32px !important;
		color: #000000 !important;
		margin: 0 !important;
	}

	/* Prism.js JSON Syntax Highlighting - Mac OS X Aqua Theme */
	:global(.token.property) {
		color: #0066cc !important;
		font-weight: 600 !important;
	}

	:global(.token.string) {
		color: #009900 !important;
	}

	:global(.token.number) {
		color: #cc6600 !important;
	}

	:global(.token.boolean) {
		color: #990099 !important;
		font-weight: 600 !important;
	}

	:global(.token.punctuation) {
		color: #666666 !important;
	}

	:global(.token.operator) {
		color: #666666 !important;
	}

	:global(.token.bracket) {
		color: #000000 !important;
		font-weight: bold !important;
	}

	/* Terminal Theme Styles */
	.terminal-theme {
		display: flex;
		flex-direction: column;
		border: 1px solid #3c3c3c;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.terminal-bar {
		display: flex;
		align-items: center;
		padding: 8px 12px;
		border-bottom: 1px solid #3c3c3c;
		font-size: 12px;
		font-weight: 500;
		min-height: 32px;
	}

	.terminal-buttons {
		display: flex;
		gap: 6px;
		margin-right: 12px;
	}

	.terminal-button {
		border-radius: 50%;
		cursor: pointer;
		transition: opacity 0.2s ease;
	}

	.terminal-button:hover {
		opacity: 0.7;
	}

	.terminal-title {
		flex: 1;
		text-align: center;
		color: inherit;
	}

	.terminal-theme .preview-text {
		flex: 1;
		padding: 16px;
		position: relative;
	}

	.preview-text {
		margin: 0 !important;
		padding: 0 !important;
		white-space: pre-wrap;
		line-height: 1.5;
		font-family: inherit;
		box-sizing: border-box;
		text-align: left !important;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: block;
		text-indent: 0 !important;
		transform: none !important;
		justify-content: flex-start !important;
		align-items: flex-start !important;
	}

	.cursor {
		animation: blink 1s infinite;
		font-weight: bold;
	}

	@keyframes blink {
		0%, 50% { 
			opacity: 1; 
		}
		51%, 100% { 
			opacity: 0; 
		}
	}
</style>
