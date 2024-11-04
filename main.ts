import { Editor, MarkdownPostProcessorContext, MarkdownRenderChild, MarkdownView, Modal, Notice, Plugin } from 'obsidian';
import { SyllogismSettingsTab } from 'SyllogismSettingsTab';
import { SyllogismSettings, DEFAULT_SETTINGS } from 'SyllogismSettings';
import SyllogismParser from 'SyllogismParser';
import SyllogismRenderer from 'SyllogismRenderer';

export default class Syllogism extends Plugin {
	settings: SyllogismSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new SyllogismSettingsTab(this.app, this));
		this.registerMarkdownCodeBlockProcessor("syllogism", this.codeProcessor);
	}

	async codeProcessor(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
		const parser = new SyllogismParser();
		const renderer = new SyllogismRenderer();

		var rows = await parser.parse(source);
		var table = await renderer.renderTable(rows);

		var renderChild = new MarkdownRenderChild(el);
		renderChild.containerEl.innerHTML = table;
		ctx.addChild(renderChild);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}