
const express = require('express');
const fs = require('fs');
const path = require('path');

const Snippet = require('./snippet');

// initializes the app
const app = express();

app.get('/', async (request, response) => {
    // creates a new snippet object
    var snippet = new Snippet({
        paddingX: request.query.paddingX,
        paddingY: request.query.paddingY,
        lineHeight: request.query.lineHeight,
        lineSpacing: request.query.lineSpacing,
        fontSize: request.query.fontSize,
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
                    src: url('https://cdn.jsdelivr.net/npm/hack-font@3.3.0/build/web/fonts/hack-regular-subset.woff2?sha=3114f1256') format('woff2'), url('fonts/hack-regular-subset.woff?sha=3114f1256') format('woff');
                    font-weight: 400;
                    font-style: normal;
                }
                
                @font-face {
                    font-family: 'Hack';
                    src: url('https://cdn.jsdelivr.net/npm/hack-font@3.3.0/build/web/fonts/hack-bold-subset.woff2?sha=3114f1256') format('woff2'), url('fonts/hack-bold-subset.woff?sha=3114f1256') format('woff');
                    font-weight: 700;
                    font-style: normal;
                }
                
                @font-face {
                    font-family: 'Hack';
                    src: url('https://cdn.jsdelivr.net/npm/hack-font@3.3.0/build/web/fonts/hack-italic-subset.woff2?sha=3114f1256') format('woff2'), url('fonts/hack-italic-webfont.woff?sha=3114f1256') format('woff');
                    font-weight: 400;
                    font-style: italic;
                }
                
                @font-face {
                    font-family: 'Hack';
                    src: url('https://cdn.jsdelivr.net/npm/hack-font@3.3.0/build/web/fonts/hack-bolditalic-subset.woff2?sha=3114f1256') format('woff2'), url('fonts/hack-bolditalic-subset.woff?sha=3114f1256') format('woff');
                    font-weight: 700;
                    font-style: italic;
                }           

                * {
                    font-size: ${snippet.fontSize};
                }

                ${fs.readFileSync(path.join(process.cwd(), `./api/styles/${snippet.theme}.css`)).toString()}
            </style>

            <defs>
                <style type="text/css">@import url('//cdn.jsdelivr.net/npm/hack-font@3.3.0/build/web/hack-subset.css');</style>
            </defs>

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