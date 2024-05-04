const express = require('express');
const fs = require('fs');
const path = require('path');

const Snippet = require('./snippet');
const Validator = require('./validator');
const Fonts = require('./fonts.json');

// initializes the app
const app = express();

// use the validation middleware
app.use(Validator);

app.get('/', async (request, response) => {
    // creates a new snippet object
    var snippet = new Snippet({
        paddingX: request.query.paddingX,
        paddingY: request.query.paddingY,
        lineHeight: request.query.lineHeight,
        lineSpacing: request.query.lineSpacing,
        indentSize: request.query.indentSize,
        theme: request.query.theme,
        background: request.query.background,
    });

    if (!request.query.object) return response.status(400).send('Object not provided.'); // if the object is not provided, return an error

    // stores the result in a variable
    var result = await snippet.process(request.query.object);
    var height = result.length * snippet.lineHeight + snippet.paddingY + ((result.length - 1) * snippet.lineSpacing);

    var svg = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 600 ${height}" font-family="Hack" class="${!snippet.background || 'hljs'}">
            <style>
                /*!
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
                    font-size: ${snippet.fontSize};
                    font-family: 'Hack';
                }

                ${fs.readFileSync(path.join(process.cwd(), `./api/styles/${snippet.theme}.css`)).toString()}
            </style>

            ${result.join('')}
        </svg>
    `;

    response.writeHead(200, {
        'Content-Type': 'image/svg+xml',
        'Content-Length': svg.length
    });
    response.end(svg);
});

app.listen(3000, () => console.log("Server ready on port 3000!")); // im all ears 👂

module.exports = app;