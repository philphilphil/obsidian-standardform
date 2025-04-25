import { Argument, ConclusionDivider, StandardFormConstruction } from "./StandardFormConstruction";


class StandardFormParser {
    readonly premissePattern = /(.*?[.:])?\s*(.*)/;
    readonly dividerPattern = /--\s*(.*?)\s*--/;

    parse(codeblock_content: string): Promise<StandardFormConstruction> {
        const sfc: StandardFormConstruction = new StandardFormConstruction();

        const lines = codeblock_content.split('\n').map(line => line.trim());

        for (const line of lines) {
            let match;
            //console.log(`Line: ${line}`);

            if (line.trim() == "--") {
                sfc.elements.push(new ConclusionDivider("", true));
            } else if ((match = line.match(this.dividerPattern))) {
                const conclusionPrinciple = match[1];  // eg "KS(P1, P2)"
                //console.log(`Matched divider: ${match[1]}`);

                sfc.elements.push(new ConclusionDivider(conclusionPrinciple, false));
            } else if ((match = line.match(this.premissePattern))) {
                const type = match[1] ?? "";  // eg. "P1:"
                const text = match[2];  // Sentence following "P1:"
                //console.log(`Matched premisse: ${type} ${text}`);

                sfc.elements.push(new Argument(type, text));
            }
            else {
                console.log(`Line not recognized: ${line}`);
            }
        }
        return Promise.resolve(sfc);
    }
}

export default StandardFormParser;
