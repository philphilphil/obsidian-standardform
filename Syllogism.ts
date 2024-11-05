class Syllogism {
    lines: Element[] = [];
    // for now i think i like a more flexible and dynamic approach and dont force it into strict classes
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

export { Syllogism, Element, Argument, ConclusionDivider  };
