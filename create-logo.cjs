const fs = require('fs');
const path = require('path');
const buffer = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", 'base64');
fs.writeFileSync(path.join(__dirname, 'src/components/App_logo/logo.png'), buffer);
console.log("Created logo.png");
