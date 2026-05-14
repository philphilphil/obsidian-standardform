import { describe, expect, it, beforeEach } from "vitest";
import StandardFormElement from "../src/StandardFormElement";
import {
	Argument,
	ConclusionDivider,
	DividerType,
	StandardFormConstruction,
} from "../src/StandardFormConstruction";

function build(...elements: Array<Argument | ConclusionDivider>) {
	const sfc = new StandardFormConstruction();
	sfc.elements = elements;
	return sfc;
}

function render(sfc: StandardFormConstruction): HTMLElement {
	const host = document.createElement("div");
	new StandardFormElement(host, sfc).onload();
	return host;
}

describe("StandardFormElement — table structure", () => {
	let host: HTMLElement;

	beforeEach(() => {
		host = render(
			build(
				new Argument("P1:", "All men are mortal."),
				new Argument("P2:", "Socrates is a man."),
				new ConclusionDivider(DividerType.TextLine, "MP"),
				new Argument("C:", "Socrates is mortal."),
			),
		);
	});

	it("emits a single <table> as the only child", () => {
		expect(host.children).toHaveLength(1);
		expect(host.firstElementChild?.tagName).toBe("TABLE");
	});

	it("emits one <tr> per construction element", () => {
		const rows = host.querySelectorAll("tr");
		expect(rows).toHaveLength(4);
	});

	it("emits two <td>s per row when any element has a label", () => {
		const rows = host.querySelectorAll("tr");
		rows.forEach((row) => expect(row.children).toHaveLength(2));
	});

	it("renders labels and text in their respective cells", () => {
		const firstRow = host.querySelectorAll("tr")[0];
		expect(firstRow.children[0].textContent).toBe("P1:");
		expect(firstRow.children[1].textContent).toBe("All men are mortal.");
	});
});

describe("StandardFormElement — label column suppression", () => {
	it("omits the label column entirely when no element has a label", () => {
		const host = render(
			build(
				new Argument("", "if p, then q"),
				new Argument("", "not q"),
				new ConclusionDivider(DividerType.Line),
				new Argument("", "not p"),
			),
		);
		const rows = host.querySelectorAll("tr");
		rows.forEach((row) => expect(row.children).toHaveLength(1));
		expect(rows[0].children[0].textContent).toBe("if p, then q");
	});

	it("keeps the label column when at least one element has a label", () => {
		const host = render(
			build(
				new Argument("", "no label here"),
				new Argument("P:", "but this one has one"),
			),
		);
		const rows = host.querySelectorAll("tr");
		rows.forEach((row) => expect(row.children).toHaveLength(2));
		expect(rows[0].children[0].textContent).toBe("");
		expect(rows[1].children[0].textContent).toBe("P:");
	});
});

describe("StandardFormElement — divider rendering", () => {
	function dividerDiv(d: ConclusionDivider): HTMLElement {
		const host = render(build(d));
		const div = host.querySelector("td > div");
		if (!div) throw new Error("no divider div rendered");
		return div as HTMLElement;
	}

	it("renders a Line divider with conclusionLong class", () => {
		const d = dividerDiv(new ConclusionDivider(DividerType.Line));
		expect(d.className).toBe("conclusionLong");
		expect(d.textContent).toBe("");
	});

	it("renders a DoubleLine divider with conclusionDouble class", () => {
		const d = dividerDiv(new ConclusionDivider(DividerType.DoubleLine));
		expect(d.className).toBe("conclusionDouble");
	});

	it("renders a TextLine divider with conclusionText class and text", () => {
		const d = dividerDiv(new ConclusionDivider(DividerType.TextLine, "MP"));
		expect(d.className).toBe("conclusionText");
		expect(d.textContent).toBe("MP");
	});

	it("renders a DoubleTextLine divider with conclusionDoubleText class and text", () => {
		const d = dividerDiv(
			new ConclusionDivider(DividerType.DoubleTextLine, "IBE"),
		);
		expect(d.className).toBe("conclusionDoubleText");
		expect(d.textContent).toBe("IBE");
	});
});

describe("StandardFormElement — escape unwrapping at render time", () => {
	it("unwraps escaped periods", () => {
		const host = render(build(new Argument("", "He said hi\\. then left.")));
		const cell = host.querySelector("tr > td");
		expect(cell?.textContent).toBe("He said hi. then left.");
	});

	it("unwraps escaped colons", () => {
		const host = render(build(new Argument("", "Note\\: this is the text")));
		const cell = host.querySelector("tr > td");
		expect(cell?.textContent).toBe("Note: this is the text");
	});

	it("unwraps both escape types in the same string", () => {
		const host = render(
			build(new Argument("", "A\\. B\\: C\\. D\\: end")),
		);
		const cell = host.querySelector("tr > td");
		expect(cell?.textContent).toBe("A. B: C. D: end");
	});
});

describe("StandardFormElement — desired behavior (TDD)", () => {
	it("unwraps escape sequences in labels, not just text", async () => {
		// The parser preserves `\.` and `\:` verbatim in both fields,
		// so the renderer must unwrap both for symmetric output.
		const host = render(build(new Argument("Note\\.A:", "body")));
		const labelCell = host.querySelector("tr > td:first-child");
		expect(labelCell?.textContent).toBe("Note.A:");
	});
});

describe("StandardFormElement — empty input", () => {
	it("renders an empty table when the construction has no elements", () => {
		const host = render(build());
		expect(host.firstElementChild?.tagName).toBe("TABLE");
		expect(host.querySelectorAll("tr")).toHaveLength(0);
	});
});
