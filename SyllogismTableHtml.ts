export class SyllogismTableHtml {
    static readonly TABLE_HEAD = 
    `
    <style>
        .block-language-syllogism table {
            border-collapse: collapse;
            padding: 0;
            margin: 0;
        }

        .block-language-syllogism td {
            border: 1;
            padding: 0;
            margin: 0;
        }

        .block-language-syllogism .conclusion {
            display: grid;
            grid-template-columns: 30px max-content 30px;
            grid-column-gap: 5px;
            align-items: center;
        }

        .block-language-syllogism .conclusion::before,
        .block-language-syllogism .conclusion::after {
            content: "";
            display: block;
            height: 1.5px;
            background-color: currentColor;
        }
    </style>
    <table>`;
    static readonly TABLE_TAIL = `</table>`;
}