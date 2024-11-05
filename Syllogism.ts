class Syllogism {
    lines: Element[] = [];
    // for now i think i like a more flexible and dynamic approach and dont force it into classes
    // premisses: string[];
    // conclusion: string;

    // constructor(premisses: string[], conclusion: string) {
    //     this.premisses = premisses;
    //     this.conclusion = conclusion;
    // }
}

class Element { 
    text: string;
    type: string;

    constructor(type: string, text: string) {
        this.text = text;
        this.type = type;
    }
}

class Argument extends Element {
}

class ConclusionDivider extends Element {
    conclusionPrinciple: string;
    constructor(conclusionPrinciple: string) {
        super("", "");
        this.conclusionPrinciple = conclusionPrinciple;
    }
}

export { Syllogism, Element as Line, Argument as LinePair, ConclusionDivider as Divider };
