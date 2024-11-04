import { Divider, LinePair, Syllogism } from "Syllogism";
import { SyllogismSettings } from "SyllogismSettings";

class SyllogismRenderer {
    settings: SyllogismSettings
    readonly table_head = `<table style="border: none;"><tbody style="border: none;">`;
    readonly table_tail = `</tbody></table>`;

    // constructor(settings: SyllogismSettings) {
    //     this.settings = settings;
    // }

    renderTable(syllogism: Syllogism): Promise<string> {
        let htmlOutput = this.table_head;

        for (const line of syllogism.lines) {
            if (line instanceof LinePair) {
                // Extracts line text for LinePair without the identifier prefix (e.g., "P1:")
                const lineText = line.text;
                htmlOutput += `
                <tr style="border: none;">
                    <td style="border: none;"></td>
                    <td style="border: none;">${lineText}</td>
                </tr>
            `;
            } else if (line instanceof Divider) {
                // Handles Divider with conclusionPrinciple
                const intro = `(${line.conclusionPrinciple})`;
                const conclusion = line.text;
                htmlOutput += `
                <tr style="border: none;">
                    <td style="padding-right:1em; font-style:italic; border: none;">${intro}</td>
                    <td style="border: none; border-top: 2px solid; padding-top: 0.5em;">${conclusion}</td>
                </tr>
            `;
            }
        }
        return Promise.resolve(htmlOutput + this.table_tail);
    }
}

export default SyllogismRenderer;