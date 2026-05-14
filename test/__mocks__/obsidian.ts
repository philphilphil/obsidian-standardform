export class MarkdownRenderChild {
	containerEl: HTMLElement;
	constructor(containerEl: HTMLElement) {
		this.containerEl = containerEl;
	}
	onload() {}
	onunload() {}
}

export class Plugin {}

export type MarkdownPostProcessorContext = unknown;
