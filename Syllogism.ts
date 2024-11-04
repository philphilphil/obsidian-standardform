class Syllogism {
    lines: Line[] = [];
    // for now i think i like a more flexible and dynamic approach and dont force it into classes
    // premisses: string[];
    // conclusion: string;

    // constructor(premisses: string[], conclusion: string) {
    //     this.premisses = premisses;
    //     this.conclusion = conclusion;
    // }
}

class Line { 
    text: string;
    type: string;

    constructor(type: string, text: string) {
        this.text = text;
        this.type = type;
    }
}

class LinePair extends Line {
}

class Divider extends Line {
    conclusionPrinciple: string;
    constructor(conclusionPrinciple: string) {
        super("", "");
        this.conclusionPrinciple = conclusionPrinciple;
    }
}

export { Syllogism, Line, LinePair, Divider };
