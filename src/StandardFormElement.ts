import { MarkdownRenderChild } from "obsidian";
import { Argument, ConclusionDivider, StandardFormConstruction } from "./StandardFormConstruction";

class StandardFormElement extends MarkdownRenderChild {
	constructor(
		private readonly el: HTMLElement,
		private readonly construction: StandardFormConstruction,
	) {
		super(el);
	}

	onload() {
		this.renderTable();
	}

	renderTable() {
		const table = this.el.createEl("table");
		const anyLabel = this.construction.elements.some(e => e.label !== "");

		for (const el of this.construction.elements) {
			const tr = table.createEl("tr");

			if (el instanceof Argument) {
				if (anyLabel) {
					tr.createEl("td", { text: el.label });
				}

				// remove escape backslashes
				el.text = el.text.split("\\.").join(".").split("\\:").join(":");

				tr.createEl("td", { text: el.text });
			} else if (el instanceof ConclusionDivider) {
				if (anyLabel) {
					tr.createEl("td");
				}

				const td = tr.createEl("td");
				switch (el.dividerType) {
					case 0: // Line
						td.createDiv({ cls: "conclusionLong" });
						break;
					case 1: // DoubleLine
						td.createDiv({ cls: "conclusionDouble" }); 
						break;
					case 2: // TextLine
						td.createDiv({ text: el.text, cls: "conclusionText" });
						break;
					case 3: // DoubleTextLine
						td.createDiv({ text: el.text, cls: "conclusionDoubleText" });
						break;
				}
			}
		}
	}
}

export default StandardFormElement;
