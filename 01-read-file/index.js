const fs = require('fs');
const path = require('path');

const textDir = path.join(__dirname, 'text.txt');

const readableStream = fs.createReadStream(textDir, 'utf-8');
let data = '';
readableStream.on('data', chunk => data += chunk);
readableStream.on('end', () => console.log(data));