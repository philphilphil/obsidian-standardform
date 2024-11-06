import { Argument, ConclusionDivider, StandardFormConstruction } from "StandardFormConstruction";

class SyllogismRenderer {


    renderTable(construction: StandardFormConstruction): Promise<string> {
        let htmlOutput = "<table>";

        let anyLabel = construction.elements.some(e => e.label !== "");

        for (const el of construction.elements) {
            htmlOutput += "<tr>";

            if (el instanceof Argument) {
                if (anyLabel) {
                    htmlOutput += `<td>${el.label ?? ''}</td>`;
                }

                htmlOutput += `<td>${el.text}</td></tr>`;
            } else if (el instanceof ConclusionDivider) {
                if (anyLabel) {
                    htmlOutput += "<td></td>";
                }

                if (el.strokeOnly) {
                    htmlOutput += `<td><div class="conclusionLong"></div></td></tr>`;
                } else {
                    htmlOutput += `<td><div class="conclusion">${el.conclusionPrinciple}</div></td></tr>`;
                }
            }
        }

        return Promise.resolve(htmlOutput + "</table>");
    }
}

export default SyllogismRenderer;