const hljs = require('highlight.js');
const fs = require('fs');
const path = require('path');
const Fonts = require('./fonts.json');

class Snippet {
    constructor({ paddingX = 8, paddingY = 18, lineHeight, lineSpacing = 8, fontSize = 12, indentSize = 2, oneLine = false, theme = 'obsidian', background = false }) {
        this.paddingX = parseInt(paddingX);
        this.paddingY = parseInt(paddingY ?? fontSize);

        this.lineHeight = lineHeight ?? fontSize;
        this.lineSpacing = lineSpacing;
        this.fontSize = Math.max(fontSize, 1);

        this.indentSize = Math.max(Math.min(indentSize, 8), 0); // max indent size is 8, and minimum is 0
        this.oneLine = (oneLine == 'true') ? true : false; // whether or not the code should be formatted on one line

        this.theme = theme;

        this.background = (background == 'true') ? true : false; // is there a better way of doing this???
    }

    format(string) { // formats the provided string
        string = JSON.parse(string);
        string = JSON.stringify(string, null, this.oneLine ? '' : 2); // formats the string whether or not oneline was specified
        
        return string;
    }

    async process(string) { // highlights the syntax of the provided string and applies the needed class names to each token
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

    async render(object) { // takes in the object and then renders it as an svg
        var result = await this.process(object); // processes the object
        var height = result.length * this.lineHeight + this.paddingY + ((result.length - 1) * this.lineSpacing) + this.paddingY; // calculates the height of the svg
        
        return `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 100% ${height}" font-family="Hack" class="${!this.background || 'hljs'}">
                <style>
                    /*!s
                    *  Hack typeface https://github.com/source-foundry/Hack
                    *  License: https://github.com/source-foundry/Hack/blob/master/LICENSE.md
                    */
                    /* FONT PATHS
                    * -------------------------- */
                    @font-face {
                        font-family: 'Hack';
                        src: url('${Fonts['hack-subset-woff2']}') format('woff2'),
                            url('${Fonts['hack-subset-woff']}') format('woff');
                        
                        font-weight: 400;
                        font-style: normal;
                    }
                    
                    @font-face {
                        font-family: 'Hack';
                        src: url('${Fonts['hack-subset-italic-woff2']}') format('woff2'),
                            url('${Fonts['hack-subset-italic-woff']}') format('woff');
                        
                        font-weight: 400;
                        font-style: italic;
                    }       

                    * {
                        font-size: ${this.fontSize}px;
                        font-family: 'Hack';
                    }

                    ${fs.readFileSync(path.join(process.cwd(), `./api/styles/${this.theme}.css`)).toString()}
                </style>

                ${result.join('')}
            </svg>
        `;
    }
}
module.exports = Snippet;