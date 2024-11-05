import { Argument, ConclusionDivider, Syllogism } from "Syllogism";


class SyllogismParser {
    parse(codeblock_content: string): Promise<Syllogism> {
        let syllogism: Syllogism = new Syllogism();
        const linePairPattern = /([a-zA-Z]\d*):\s(.+)/;
        const dividerPattern = /--\s*(KS\([^()]+\))\s*--/;

        const lines = codeblock_content.split('\n').map(line => line.trim()).filter(line => line);

        for (const line of lines) {
            let match;

            if ((match = line.match(linePairPattern))) {
                const type = match[1];  // e.g., "P1"
                const text = match[2];  // Sentence following "P1:"
                syllogism.lines.push(new Argument(type, text));
            }
            else if ((match = line.match(dividerPattern))) {
                const conclusionPrinciple = match[1];  // e.g., "KS(P1, P2)"
                syllogism.lines.push(new ConclusionDivider(conclusionPrinciple));
            }
            else {
                console.log(`Line not recognized: ${line}`);
            }
        }
        return Promise.resolve(syllogism);
    }
}

export default SyllogismParser;