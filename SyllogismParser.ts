class SyllogismParser {
    parseAndGenerateSyllogismTable(input: string): Promise<string> {
        const rows: string[] = [];
        let intro = ""; 
        let conclusion = ""; 

        const lines = input.split("\n").map(line => line.trim());
        lines.forEach(line => {
            if (line.startsWith("P")) {
                // Add premise
                rows.push(`
					<tr style="border: none;">
						<td style="border: none;"></td>
						<td style="border: none;">${line.substring(3).trim()}</td>
					</tr>
				`);
            } else if (line.startsWith("S:")) {
                intro = line.substring(2).trim();
            } else if (line.startsWith("C:")) {
                conclusion = line.substring(2).trim();
            }
        });

        return Promise.resolve(`
            <table style="border: none;">
                <tbody style="border: none;">
                    ${rows.join("")}
                    <tr style="border: none;">
                        <td style="padding-right:1em; font-style:italic; border: none;">${intro}</td>
                        <td style="border: none; border-top: 2px solid; padding-top: 0.5em;">${conclusion}</td>
                    </tr>
                </tbody>
            </table>
        `);
    }
}

export default SyllogismParser;