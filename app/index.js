
const express = require('express');
const serverless = require('serverless-http');
const fs = require('fs');

const Snippet = require('./snippet');

var string = `var ibrahim = {
    firstName: 'Ibrahim',
    email: 'ibrahimcajlakovic1@gmail.com',
    age: 18,
    skills: [
      'react',
      'flutter',
      'mongodb'
    ],
    hobbies: [
      'design',
      'electronics'
    ]
  }`;

// initializes the app
const app = express();
app.use('/.netlify/functions/server', router);  // path must route to lambda

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

    // stores the result in a variable
    var result = await snippet.process(request.query.object);

    response.send(`
        <html>
            <head>
                <link rel='stylesheet' href='//cdn.jsdelivr.net/npm/hack-font@3.3.0/build/web/hack-subset.css'>
            
                <style>
                    html, body { margin: 0; }
                </style>
            </head>
            
            <body>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 ${result.length * snippet.lineHeight + snippet.paddingY + ((result.length - 1) * snippet.lineSpacing)}" font-family="Hack" class="${!snippet.background || 'hljs'}">
                    <style>
                        * {
                            font-size: ${snippet.fontSize};
                        }

                        ${fs.readFileSync(`./app/styles/${snippet.theme}.css`).toString()}
                    </style>

                    ${result.join('')}
                </svg>
            </body>
        </html>
    `);
});

// app.listen(4040); // im all ears 👂
module.exports.handler = serverless(app);