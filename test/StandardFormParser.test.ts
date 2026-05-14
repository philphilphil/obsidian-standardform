import { describe, expect, it } from "vitest";
import StandardFormParser from "../src/StandardFormParser";
import {
	Argument,
	ConclusionDivider,
	DividerType,
} from "../src/StandardFormConstruction";

async function parse(input: string) {
	return (await new StandardFormParser().parse(input)).elements;
}

describe("StandardFormParser — premises", () => {
	it("parses a labeled premise with a colon", async () => {
		const els = await parse("P1: All men are mortal.");
		expect(els).toHaveLength(1);
		expect(els[0]).toBeInstanceOf(Argument);
		expect(els[0].label).toBe("P1:");
		expect(els[0].text).toBe("All men are mortal.");
	});

	it("parses a labeled premise with a period", async () => {
		const els = await parse("1. Socrates is a man.");
		expect(els[0].label).toBe("1.");
		expect(els[0].text).toBe("Socrates is a man.");
	});

	it("parses an unlabeled premise (no terminator in line)", async () => {
		const els = await parse("if p, then q");
		expect(els).toHaveLength(1);
		expect(els[0]).toBeInstanceOf(Argument);
		expect(els[0].label).toBe("");
		expect(els[0].text).toBe("if p, then q");
	});

	it("uses lazy match so only the first '.' / ':' becomes the label terminator", async () => {
		const els = await parse("P1: foo: bar");
		expect(els[0].label).toBe("P1:");
		expect(els[0].text).toBe("foo: bar");
	});

	it("respects backslash-escaped colons and periods inside premise text", async () => {
		const els = await parse("P1: He said\\: hello.");
		expect(els[0].label).toBe("P1:");
		// the parser keeps escapes; the renderer is responsible for unwrapping them.
		expect(els[0].text).toBe("He said\\: hello.");
	});

	it("respects backslash-escaped periods", async () => {
		const els = await parse("Note\\. still the label: body");
		expect(els[0].label).toBe("Note\\. still the label:");
		expect(els[0].text).toBe("body");
	});

	it("trims leading/trailing whitespace per line", async () => {
		const els = await parse("   P1: trimmed   ");
		expect(els[0].label).toBe("P1:");
		expect(els[0].text).toBe("trimmed");
	});

	it("treats a bare label (no body) as label-less text", async () => {
		// Quirk: if a line is just `P1:` the parser flips it so the
		// label string becomes the displayed text. Documented here so
		// future refactors don't silently change the behavior.
		const els = await parse("P1:");
		expect(els[0]).toBeInstanceOf(Argument);
		expect(els[0].label).toBe("");
		expect(els[0].text).toBe("P1:");
	});

	it("produces no elements for empty input", async () => {
		const els = await parse("");
		expect(els).toHaveLength(0);
	});
});

describe("StandardFormParser — dividers", () => {
	it("parses a bare single-line divider", async () => {
		const els = await parse("--");
		expect(els[0]).toBeInstanceOf(ConclusionDivider);
		expect((els[0] as ConclusionDivider).dividerType).toBe(DividerType.Line);
		expect(els[0].text).toBe("");
	});

	it("parses a bare double-line divider", async () => {
		const els = await parse("==");
		expect((els[0] as ConclusionDivider).dividerType).toBe(
			DividerType.DoubleLine,
		);
	});

	it("parses a single-line divider with inline text", async () => {
		const els = await parse("-- MP (P1, P2) --");
		const d = els[0] as ConclusionDivider;
		expect(d.dividerType).toBe(DividerType.TextLine);
		expect(d.text).toBe("MP (P1, P2)");
	});

	it("parses a double-line divider with inline text", async () => {
		const els = await parse("== IBE ==");
		const d = els[0] as ConclusionDivider;
		expect(d.dividerType).toBe(DividerType.DoubleTextLine);
		expect(d.text).toBe("IBE");
	});

	it("strips whitespace around divider text", async () => {
		const els = await parse("--    MP    --");
		expect(els[0].text).toBe("MP");
	});
});

describe("StandardFormParser — full constructions", () => {
	it("parses a multi-line classical syllogism", async () => {
		const els = await parse(
			[
				"P1: All men are mortal.",
				"P2: Socrates is a man.",
				"-- MP --",
				"C: Socrates is mortal.",
			].join("\n"),
		);

		expect(els).toHaveLength(4);
		expect(els[0]).toBeInstanceOf(Argument);
		expect(els[1]).toBeInstanceOf(Argument);
		expect(els[2]).toBeInstanceOf(ConclusionDivider);
		expect(els[3]).toBeInstanceOf(Argument);

		expect(els[0].label).toBe("P1:");
		expect((els[2] as ConclusionDivider).dividerType).toBe(
			DividerType.TextLine,
		);
		expect(els[2].text).toBe("MP");
		expect(els[3].label).toBe("C:");
	});

	it("parses the README example with intermediate conclusion", async () => {
		const els = await parse(
			[
				"1. If someone is a programmer, then they prefer tools that support Markdown.",
				"2. If someone prefers tools that support Markdown, then they enjoy using Obsidian.",
				" -- CI (1, 2) --",
				"IC: If someone is a programmer, then they enjoy using Obsidian.",
				"3. Phil is a programmer.",
				"-- MP (IC, 3) --",
				"C: Phil enjoys using Obsidian.",
			].join("\n"),
		);

		expect(els.map((e) => e.constructor.name)).toEqual([
			"Argument",
			"Argument",
			"ConclusionDivider",
			"Argument",
			"Argument",
			"ConclusionDivider",
			"Argument",
		]);
		expect(els[0].label).toBe("1.");
		expect(els[2].text).toBe("CI (1, 2)");
		expect(els[5].text).toBe("MP (IC, 3)");
	});

	it("parses the unlabeled README example with a bare divider", async () => {
		const els = await parse(["if p, then q", "not q", "--", "not p"].join("\n"));
		expect(els.map((e) => e.label)).toEqual(["", "", "", ""]);
		expect((els[2] as ConclusionDivider).dividerType).toBe(DividerType.Line);
		expect(els[3].text).toBe("not p");
	});
});

describe("StandardFormParser — desired behavior (TDD)", () => {
	it("does not treat a premise line containing two '--' tokens as a divider", async () => {
		// `1. He said -- hi -- there.` is a sentence, not a conclusion line.
		// A divider must occupy the whole line.
		const els = await parse("1. He said -- hi -- there.");
		expect(els).toHaveLength(1);
		expect(els[0]).toBeInstanceOf(Argument);
		expect(els[0].label).toBe("1.");
		expect(els[0].text).toBe("He said -- hi -- there.");
	});

	it("still recognizes a divider with surrounding whitespace", async () => {
		// Lines are pre-trimmed, so the anchored regex must still match
		// after trimming.
		const els = await parse("   -- MP --   ");
		expect(els[0]).toBeInstanceOf(ConclusionDivider);
		expect((els[0] as ConclusionDivider).dividerType).toBe(
			DividerType.TextLine,
		);
		expect(els[0].text).toBe("MP");
	});

	it("skips blank lines between elements", async () => {
		// Blank lines should be visual breathing room in source, not
		// extra rows in the rendered table.
		const els = await parse(
			["P1: foo", "", "P2: bar", "   ", "--", "C: baz"].join("\n"),
		);
		expect(els).toHaveLength(4);
		expect(els.map((e) => e.constructor.name)).toEqual([
			"Argument",
			"Argument",
			"ConclusionDivider",
			"Argument",
		]);
	});

	it("parses CRLF line endings the same as LF", async () => {
		const els = await parse("P1: foo\r\nP2: bar\r\n--\r\nC: baz");
		expect(els).toHaveLength(4);
		expect(els[0].label).toBe("P1:");
		expect(els[0].text).toBe("foo");
		expect((els[2] as ConclusionDivider).dividerType).toBe(DividerType.Line);
	});
});
