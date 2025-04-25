class StandardFormConstruction {
    elements: Element[] = [];
    // for now i think i like a more flexible and dynamic approach and dont force it into strict classes
}

class Element { 
    text: string;
    label: string;

    constructor(label: string, text: string) {
        this.text = text;
        this.label = label;
    }
}

class Argument extends Element {
}

class ConclusionDivider extends Element {
    conclusionPrinciple: string;
    strokeOnly: boolean ;
    constructor(conclusionPrinciple: string, strokeOnly: boolean) {
        super("", "");
        this.conclusionPrinciple = conclusionPrinciple;
        this.strokeOnly = strokeOnly;
    }
  
}

export { StandardFormConstruction, Element, Argument, ConclusionDivider  };
