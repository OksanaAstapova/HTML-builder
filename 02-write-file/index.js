const fs = require('fs');
const path = require('path');

const pathText = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(pathText);
const {stdin, stdout, exit} = process;

stdout.write('Please, write down your text.. \n');

stdin.on('data', msg => {if (msg.toString().trim() === 'exit') exit();
output.write(msg.toString());
});
 process.on('exit', () => stdout.write('Good Bye!'));
 process.on('SIGINT', exit);