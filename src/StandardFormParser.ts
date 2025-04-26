import { Argument, ConclusionDivider, DividerType, StandardFormConstruction } from "./StandardFormConstruction";


class StandardFormParser {
	readonly premissePattern = /(.*?[.:])?\s*(.*)/;
	readonly dividerPattern = /(--|==)\s*(.*?)\s*(?:--|==)/;

	parse(codeblock_content: string): Promise<StandardFormConstruction> {
		const sfc: StandardFormConstruction = new StandardFormConstruction();

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
				console.log(`Matched divider: ${match[1]}`);
				console.log(`Matched text: ${match[2]}`);
				const dividerType = match[1];  // eg "--" or "=="
				const conclusionPrinciple = match[2];  // eg "KS(P1, P2)"

				if (dividerType == "--") {
					sfc.elements.push(new ConclusionDivider(DividerType.TextLine, conclusionPrinciple));
				} else if (dividerType == "==") {
					sfc.elements.push(new ConclusionDivider(DividerType.DoubleTextLine, conclusionPrinciple));
				}
			} else if ((match = line.match(this.premissePattern))) {
				const type = match[1] ?? "";  // eg. "P1:"
				const text = match[2];  // Sentence following "P1:"
				//console.log(`Matched premisse: ${type} ${text}`);

				// if text is empty, but type is filled, a dot or colon is used in the text without a premise
				if (text == "" && type != "") {
					//submit type as text
					sfc.elements.push(new Argument("", type));
					continue;
				}

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
