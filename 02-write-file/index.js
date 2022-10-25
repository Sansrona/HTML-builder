const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');

const text = path.resolve(__dirname, 'text.txt');

const stream = fs.createWriteStream(text);

console.log('Введите текст');

process.stdin.on('data', (code) => {
    if (`${code}`.trim() === 'exit') {
        console.log('Вы уходите(');
        process.exit();
    }
    console.log('Введите текст');
    stream.write(code);
})

process.on('SIGINT', () => {
    console.log('Вы уходите(');
    process.exit();
})