const fs = require('fs');
const path = require('path');

// reads the file from the specified path
module.exports = (file) => fs.readFileSync(path.join(process.cwd(), `./api/${file}`));