<script lang="ts">
	import { settings, typingState, updateTypingState } from '../stores';

	interface Props {
		cursorElement: HTMLSpanElement | undefined;
	}

	let { cursorElement = $bindable() }: Props = $props();

	let { isEditMode, sourceText, previewText } = $derived($typingState);
	let { backgroundColor, textColor, fontSize, fontFamily, previewTextSize } = $derived($settings);

	let previewElement: HTMLDivElement;
	let textareaElement: HTMLTextAreaElement;

	function handleSourceTextChange(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		updateTypingState('sourceText', target.value);
	}

	function handleCursorRef(element: HTMLSpanElement) {
		cursorElement = element;
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
		<div 
			bind:this={previewElement}
			class="preview-screen"
			style="background-color: {backgroundColor}; color: {textColor}; font-size: {previewTextSize}px; font-family: {fontFamily};"
		>
			<div class="preview-text">
				{previewText}
				<span bind:this={cursorElement} class="cursor">|</span>
			</div>
		</div>
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
