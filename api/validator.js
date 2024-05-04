const fs = require("fs");
const path = require("path");
const error = require("./error");

module.exports = (request, response, next) => {
    if (request.path === "/") {
        if (!request.query.object) return error(response, 400, 'Object not provided.'); // if the object is not provided, return an error

        if (request.query.theme && !fs.existsSync(path.join(process.cwd(), `./api/styles/${request.query.theme}.css`))) {
            return error(response, 400, 'Invalid theme provided.');
        }

        try {
            JSON.parse(request.query.object); // try to parse the object

            const invalidParams = Object.keys(request.query).filter((parameter) => {
                const value = request.query[parameter];

                var isNumber = (number) => { return !isNaN(parseInt(number)); }

                switch (parameter) {
                    case 'paddingX':
                    case 'paddingY':
                    case 'lineSpacing':
                    case 'indentSize':
                        return !isNumber(value);
                    default:
                        return false;
                }
            });
            
            if (invalidParams.length === 0) next(); // call the next middleware or route handler
            else error(response, 400, `Invalid parameter value: ${invalidParams.join(', ')}`);
        } catch (e) {
            return error(response, 400, 'Invalid JSON object provided.'); // if the object is invalid, return an error
        }
    } else error(response, 404, 'Not found.');
};
