import { Argument, ConclusionDivider, DividerType, StandardFormConstruction } from "./StandardFormConstruction";


class StandardFormParser {
	readonly premissePattern = /(.*?(?<!\\)[.:])?\s*(.*)/;
	readonly dividerPattern = /(--|==)\s*(.*?)\s*(?:--|==)/;

	parse(codeblock_content: string): Promise<StandardFormConstruction> {
		const sfc = new StandardFormConstruction();
		const lines = codeblock_content.split('\n').map(line => line.trim());

		for (const line of lines) {
			let match;
			//console.log(`Line: ${line}`);

			if (line.trim() == "--") {
				sfc.elements.push(new ConclusionDivider(DividerType.Line));
			}
			else if (line.trim() == "==") {
				sfc.elements.push(new ConclusionDivider(DividerType.DoubleLine));
			} else if ((match = line.match(this.dividerPattern))) {
				const dividerType = match[1];  // "--" or "=="
				const conclusionPrinciple = match[2];  // eg. "KS(P1, P2)"

				//console.log(`Divider: ${dividerType} ConclusionPrinciple: ${conclusionPrinciple}`);

				if (dividerType == "--") {
					sfc.elements.push(new ConclusionDivider(DividerType.TextLine, conclusionPrinciple));
				} else if (dividerType == "==") {
					sfc.elements.push(new ConclusionDivider(DividerType.DoubleTextLine, conclusionPrinciple));
				}
			} else if ((match = line.match(this.premissePattern))) {
				const type = match[1] ?? "";  // eg. "P1:"
				const text = match[2];  // Sentence following "P1:"
				//console.log(`Type: ${type} Text: ${text}`);

				// if text is empty, but type is filled, a dot or colon is used in the text without a premise
				// in this case we want to submit the type as text
				if (text == "" && type != "") {
					sfc.elements.push(new Argument("", type));
				} else {
					sfc.elements.push(new Argument(type, text));
				}
			}
			else {
				console.log(`Line not recognized: ${line}`);
			}
		}
		return Promise.resolve(sfc);
	}
}

export default StandardFormParser;
