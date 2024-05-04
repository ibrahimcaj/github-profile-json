const express = require('express');

const Snippet = require('./snippet');
const Validator = require('./validator');
const error = require('./error');

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

    // stores the rendered svg in a variable
    var svg = await snippet.render(request.query.object);

    response.writeHead(200, {
        'Content-Type': 'image/svg+xml',
        'Content-Length': svg.length
    });
    response.end(svg);
});

app.listen(3000, () => console.log("Server ready on port 3000!")); // im all ears 👂

module.exports = app;