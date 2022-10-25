const fs = require('node:fs');
const path = require('node:path');

const text = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(text, { encoding: 'utf-8' });
stream.on('data', data => console.log(data));