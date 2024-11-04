import { Divider, Line, LinePair, Syllogism } from "Syllogism";

class SyllogismParser {
    parse(codeblock_content: string): Promise<Syllogism> {
        let syllogism: Syllogism = new Syllogism();
        // Define regex patterns
        const linePairPattern = /([a-zA-Z]\d*):\s(.+)/;
        const dividerPattern = /--\s*(KS\([^()]+\))\s*--/;

        // Split input into lines
        const lines = codeblock_content.split('\n').map(line => line.trim()).filter(line => line);

        for (const line of lines) {
            let match;

            // Check if the line matches the LinePair pattern
            if ((match = line.match(linePairPattern))) {
                const type = match[1];  // e.g., "P1"
                const text = match[2];  // Sentence following "P1:"
                syllogism.lines.push(new LinePair(type, text));
            }
            // Check if the line matches the Divider pattern
            else if ((match = line.match(dividerPattern))) {
                const conclusionPrinciple = match[1];  // e.g., "KS(P1, P2)"
                syllogism.lines.push(new Divider(conclusionPrinciple));
            }
            // Any other line type can be handled here if needed
            else {
                syllogism.lines.push(new Line("Unknown", line));
            }
        }
        return Promise.resolve(syllogism);
    }
}

export default SyllogismParser;