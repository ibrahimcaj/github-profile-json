module.exports = (request, response, next) => {
    if (request.path === "/") {
        const invalidParams = Object.keys(request.query).filter((parameter) => {
            const value = request.query[parameter];
            const valueType = typeof value;

            function isNumber(value) { return !isNaN(parseInt(value)); }

            switch (parameter) {
                case 'paddingX':
                    return !isNumber(parameter);
                case 'paddingY':
                    return !isNumber(parameter);
                case 'lineHeight':
                    return !isNumber(parameter);
                case 'lineSpacing':
                    return !isNumber(parameter);
                case 'fontSize':
                    return !isNumber(parameter);
                case 'indentSize':
                    return !isNumber(parameter);
                case 'theme':
                    return valueType !== 'string';
                default:
                    return false;
            }
        });

        if (invalidParams.length === 0) next(); // call the next middleware or route handler
        else response.status(400).send(`Invalid parameter value: ${invalidParams.join(', ')}`);
    } else response.status(404).send('Not found.');
};
