import { Argument, ConclusionDivider, Syllogism } from "Syllogism";
import { SyllogismSettings } from "SyllogismSettings";
import { SyllogismTableHtml } from "SyllogismTableHtml";

class SyllogismRenderer {
    settings: SyllogismSettings


    constructor(settings: SyllogismSettings) {
        this.settings = settings;
    }

    renderTable(syllogism: Syllogism): Promise<string> {
        let htmlOutput = SyllogismTableHtml.TABLE_HEAD;

        for (const line of syllogism.lines) {
            htmlOutput += "<tr>";

            if (line instanceof Argument) {
                if (this.settings.displayPrefixes)
                    htmlOutput += `<td>${line.type}</td>`;

                htmlOutput += `<td>${line.text}</td>  
                               </tr>`;
            } else if (line instanceof ConclusionDivider) {
                if (this.settings.displayPrefixes)
                    htmlOutput += "<td></td>";

                htmlOutput += `<td><div class="conclusion"> ${line.conclusionPrinciple} </div></td>
                               </tr>`;
            }
        }
        return Promise.resolve(htmlOutput + SyllogismTableHtml.TABLE_TAIL);
    }
}

export default SyllogismRenderer;