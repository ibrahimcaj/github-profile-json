const Snippet = require('./snippet');

module.exports = async (response, status, message) => {
    var snippet = new Snippet({ });

    var svg = await snippet.render(JSON.stringify(
        {
            error: true,
            status,
            message,
        }
    ));

    response.writeHead(status, {
        'Content-Type': 'image/svg+xml',
        'Content-Length': svg.length
    });
    response.end(svg);
}