import { Editor, MarkdownPostProcessorContext, MarkdownRenderChild, MarkdownView, Modal, Notice, Plugin } from 'obsidian';
import { SampleSettingTab } from 'SampleSettingTab';
import { SyllogismSettings, DEFAULT_SETTINGS } from 'SyllogismSettings';
import SyllogismParser from 'SyllogismParser';

export default class Syllogism extends Plugin {
	settings: SyllogismSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new SampleSettingTab(this.app, this));
		this.registerMarkdownCodeBlockProcessor("syllogism", this.codeProcessor);
	}

	async  codeProcessor(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext)  {
		var renderChild = new MarkdownRenderChild(el);
		const parser = new SyllogismParser();
		renderChild.containerEl.innerHTML = await parser.parseAndGenerateSyllogismTable(source);
		ctx.addChild(renderChild);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}