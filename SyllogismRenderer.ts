import { Divider, LinePair, Syllogism } from "Syllogism";
import { SyllogismSettings } from "SyllogismSettings";
import { SyllogismTableHtml } from "SyllogismTableHtml";

class SyllogismRenderer {
    settings: SyllogismSettings


    // constructor(settings: SyllogismSettings) {
    //     this.settings = settings;
    // }

    renderTable(syllogism: Syllogism): Promise<string> {
        let htmlOutput = SyllogismTableHtml.TABLE_HEAD;

        for (const line of syllogism.lines) {
            if (line instanceof LinePair) {
                htmlOutput += `
                <tr>
                    <td>${line.type}</td>
                    <td>${line.text}</td>
                </tr>
            `;
            } else if (line instanceof Divider) {
                htmlOutput += `
                <tr>
                    <td></td>
                    <td><div class="conclusion">${line.conclusionPrinciple}</div></td>
                </tr>
            `;
            }
        }
        return Promise.resolve(htmlOutput + SyllogismTableHtml.TABLE_TAIL);
    }
}

export default SyllogismRenderer;