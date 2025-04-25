import { MarkdownPostProcessorContext, Plugin } from 'obsidian';
import StandardFormParser from './StandardFormParser';
import StandardFormElement from './StandardFormElement';

export default class Syllogism extends Plugin {

	async onload() {
		this.registerMarkdownCodeBlockProcessor("standardform", async (source, el, ctx) => {
			await this.codeProcessor(source, el, ctx);
		});
	}

	async codeProcessor(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
		const parser = new StandardFormParser();
		const elements = await parser.parse(source);

		ctx.addChild(new StandardFormElement(el, elements));
	}
}
