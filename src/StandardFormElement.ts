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
        let table = this.el.createEl("table");
        let anyLabel = this.construction.elements.some(e => e.label !== "");

        for (const el of this.construction.elements) {
            let tr = table.createEl("tr");

            if (el instanceof Argument) {
                if (anyLabel) {
                    tr.createEl("td", { text: el.label });
                }

                tr.createEl("td", { text: el.text });
            } else if (el instanceof ConclusionDivider) {
                if (anyLabel) {
                    tr.createEl("td");
                }

                if (el.strokeOnly) {
                    let td = tr.createEl("td");
                    td.createDiv({ cls: "conclusionLong" });
                } else {
                    let td = tr.createEl("td");
                    td.createDiv({ text: el.conclusionPrinciple, cls: "conclusion" });
                }
            }
        }
    }
}

export default StandardFormElement;