// Obsidian augments HTMLElement with createEl / createDiv helpers.
// happy-dom doesn't ship them, so polyfill the subset the plugin uses.

export {};

type ElOptions = { text?: string; cls?: string };

function createEl<K extends keyof HTMLElementTagNameMap>(
	this: HTMLElement,
	tag: K,
	opts: ElOptions = {},
): HTMLElementTagNameMap[K] {
	const el = this.ownerDocument.createElement(tag);
	if (opts.text !== undefined) el.textContent = opts.text;
	if (opts.cls) el.className = opts.cls;
	this.appendChild(el);
	return el;
}

function createDiv(this: HTMLElement, opts: ElOptions = {}): HTMLDivElement {
	return createEl.call(this, "div", opts);
}

const proto = (globalThis as { HTMLElement: typeof HTMLElement }).HTMLElement
	.prototype as HTMLElement & {
	createEl: typeof createEl;
	createDiv: typeof createDiv;
};
proto.createEl = createEl;
proto.createDiv = createDiv;
