import { Editor, MarkdownPostProcessorContext, MarkdownRenderChild, MarkdownView, Modal, Notice, Plugin } from 'obsidian';
import StandardFormParser from 'StandardFormParser';
import StandardFormRenderer from 'StandardFormRenderer';

export default class Syllogism extends Plugin {

	async onload() {
		this.registerMarkdownCodeBlockProcessor("standardform", async (source, el, ctx) => {
			await this.codeProcessor(source, el, ctx);
		});
	}

	async codeProcessor(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
		const parser = new StandardFormParser();
		const renderer = new StandardFormRenderer();

		let rows = await parser.parse(source);
		let table = await renderer.renderTable(rows);

		let renderChild = new MarkdownRenderChild(el);
		renderChild.containerEl.innerHTML = table;
		ctx.addChild(renderChild);
	}
}