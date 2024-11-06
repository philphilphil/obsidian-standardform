export class StandardFormTableHtml {
    static readonly TABLE_HEAD =
        `
    <style>
        .block-language-standardform table {
            border-collapse: collapse;
            padding: 0;
            margin: 0;
        }

        .block-language-standardform td {
            min-width: 25px;
            border: 0;
            padding: 2px;
            margin: 0;
        }

        .block-language-standardform .conclusion {
            display: grid;
            grid-template-columns: 30px max-content 30px;
            grid-column-gap: 5px;
            align-items: center;
        }

        .block-language-standardform .conclusionLong {
            display: grid;
            grid-template-columns: 60px max-content 60px;
            grid-column-gap: 5px;
            align-items: center;
        }

        .block-language-standardform .conclusion::before,
        .block-language-standardform .conclusion::after,
        .block-language-standardform .conclusionLong::before,
        .block-language-standardform .conclusionLong::after {
            content: "";
            display: block;
            height: 1.5px;
            background-color: currentColor;
        }
    </style>
    <table>`;
    static readonly TABLE_TAIL = `</table>`;
}