const fs = require('fs');
const path = require('path');

const pathText = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(pathText);
const {stdin, stdout, exit} = process;
stdout.write('Please, write down your text');
stdin.on('data', data => stdout.write(data));
process.on('exit', () => stdout.write('Good Bye!'));