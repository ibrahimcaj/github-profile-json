const hljs = require('highlight.js');
const prettier = require('prettier');

class Snippet {
    constructor({ paddingX = 8, paddingY = 18, lineHeight, lineSpacing = 8, fontSize = 12, indentSize = 2, theme = 'obsidian', background = false }) {
        this.paddingX = parseInt(paddingX);
        this.paddingY = parseInt(paddingY ?? fontSize);

        this.lineHeight = lineHeight ?? fontSize;
        this.lineSpacing = lineSpacing;
        this.fontSize = Math.max(Math.min(fontSize, 20), 6); // max font size is 20, and minimum is 6

        this.indentSize = Math.max(Math.min(indentSize, 8), 0); // max indent size is 8, and minimum is 0

        this.theme = theme;

        this.background = (background == 'true') ? true : false; // is there a better way of doing this???
    }

    format(string) { // formats the provided string, just adding linebreaks - that's all
        string = string.replace(/(\(|\[|\{)/g, '$1\n'); // linebreak after every opening bracket
        string = string.replace(/,/g, ',\n'); // linebreak after every comma
        string = string.replace(/(\)|\]|\})/g, '\n$1'); // linebreak before every closing bracket
        
        return string;
    }

    async process(string) {
        string = await this.format(string);

        var lines = string.split('\n').map((line) => { // splits the provided string by linebreaks maps each line by its highlighted version
            return hljs.highlight(line, { language: 'js' }).value // highlights the provided string
                .replace(/<span/g, '<tspan').replace(/<\/span>/g, '</tspan>'); // replaces the <span> tags with <tspan> tags
        });
    
        // sets the current value of the x padding, this represents the indent + initial padding
        var currentX = this.paddingX;
    
        // great, now the lines are separated and highlighted
        // now we need to wrap each line inside of a <text> tag, with its own spacing values, from the provided this
        lines = lines.map((line, index) => {
            // specifies the x and y values of the text tag
            var string = `<text x="${currentX}" y="${index * this.lineHeight + this.paddingY + (index * this.lineSpacing)}" class="hljs">${line}</text>`;
        
            // if the current line ends in any of the three opening brackets, add an indent
            // (will get passed onto the next line and won't affect the current line as the values have been inserted above already)
            if (/[(\[{]\s*,?$/.test(line)) currentX += 7.5 * this.indentSize;
            
            // if the current line is not the last line,
            // check if the *following* line ends in any of the closing brackets, remove an indent
            // this change will also get passed onto the next line
            if (index != (lines.length - 1)) {
                if (/[)\]}]\s*,?$/.test(lines[index + 1])) currentX -= 7.5 * this.indentSize;
            }
        
            return string; // returns the string in its highlighted form with correct syntax applied
        });
    
        return lines;
    }
}
module.exports = Snippet;