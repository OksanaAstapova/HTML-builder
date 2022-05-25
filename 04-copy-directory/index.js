const fs = require('fs');
const path = require('path');
const pathDir = path.join(__dirname, 'files');
const pathCopy = path.join(__dirname, 'files-copy');

fs.mkdir(pathCopy, {
  recursive: true
}, err => {
  if (err) throw err;
});
fs.readdir(pathCopy, (err, files) => {
  for (let i = 0; i < files.length; i++) {
    fs.unlink(pathCopy + '/' + files[i], err => {
      if (err) throw err;
    });
  }
});
fs.readdir(pathDir, (err, files) => {
  if (err) throw err;
  for (let i = 0; i < files.length; i++) {
    fs.copyFile(pathDir + '/' + files[i], pathCopy + '/' + files[i], err => {
      if (err) throw err;
    });
  }
});