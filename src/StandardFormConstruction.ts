export enum DividerType {
    Line,
    DoubleLine,
    TextLine,
    DoubleTextLine
}

export class StandardFormConstruction {
    elements: Element[] = [];
    // for now i think i like a more flexible and dynamic approach and dont force it into strict classes
}

export class Element {
    constructor(public label: string, public text: string) { }
}

export class Argument extends Element { }

export class ConclusionDivider extends Element {
    public dividerType: DividerType;

    /**
     * Creates a ConclusionDivider.
     * @param dividerType The type of divider.
     * @param conclusionPrinciple Optional conclusion principle. Defaults to empty string.
     */
    constructor(dividerType: DividerType, conclusionPrinciple = "") {
        super("", "");
        this.dividerType = dividerType;
        this.text = conclusionPrinciple;
    }
}

