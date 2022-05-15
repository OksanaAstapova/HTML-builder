const fs = require('fs');
const path = require('path');


const folder = path.join(__dirname, 'secret-folder');


fs.readdir(path.join(folder), (err, files) => {
  if (err) throw err;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    fs.stat(path.join(path.join(folder), file), (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) {
        let nameObj = file.split('.');
        let name = nameObj.slice(0, (nameObj.length - 1)).join('.') + '';
        let extension = path.extname(file).split('.').join('')

        console.log(name, '-', extension, '-', stats.size + ' bytes');
      }
    });
  }
});