const express = require('express');

const Snippet = require('./snippet');
const Validator = require('./validator');

// initializes the app
const app = express();

// use the validation middleware
app.use(Validator);

app.get('/', async (request, response) => {    
    // creates a new snippet object
    var snippet = new Snippet({
        viewboxHeight: request.query.viewboxHeight,
        viewboxWidth: request.query.viewboxWidth,

        paddingX: request.query.paddingX,
        paddingY: request.query.paddingY,

        lineSpacing: request.query.lineSpacing,
        fontSize: request.query.fontSize,

        indentSize: request.query.indentSize,
        oneLine: request.query.oneLine,

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

app.listen(3000, () => console.log('Server ready on port 3000!')); // im all ears 👂

module.exports = app;