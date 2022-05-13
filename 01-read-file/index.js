const fs = require('fs');
const path = require('path');

const pathText = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(pathText);
readableStream.on('data', chunk => console.log(chunk.toString()));