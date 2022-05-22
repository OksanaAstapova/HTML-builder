const fs = require('fs');
const path = require('path');
const projectDist = path.join(__dirname, 'project-dist');
const style = path.join(__dirname, 'styles');
const assetsOld = path.join(__dirname, 'assets');
const assetsNew = path.join(projectDist, 'assets');
const template = fs.createReadStream(path.join(__dirname, 'template.html'));
const components = path.join(__dirname, 'components');
let string = '';

fs.mkdir(projectDist, {
  recursive: true
}, err => {
  if (err) throw err;
});

async function copyDir(assetsOld, assetsNew) {
  await fs.promises.mkdir(assetsNew, {
    recursive: true
  }, (err) => {
    if (err) throw err;
  });
  const files = await fs.promises.readdir(assetsOld, {
    withFileTypes: true
  });
  files.forEach(async (file) => {
    if (file.isFile()) {
      await fs.promises.copyFile(path.join(assetsOld, file.name), path.join(assetsNew, file.name));
    } else {
      copyDir(path.join(assetsOld, file.name), path.join(assetsNew, file.name));
    }
  });
}assetsNew
copyDir(assetsOld, assetsNew);

fs.readdir(style, (err, files) => {
  if (err) throw err;
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    if (path.extname(file).split('.').pop() === 'css') {
      fs.createReadStream(path.join(style, file)).on('data', data => {
        fs.createWriteStream(path.join(projectDist, 'style.css')).write(data.toString() + '\n');
      });
    }
  }
});

async function creteHtmlPage() {
  template.on('data', data => {
    string = data.toString();
    fs.readdir(components, {
      withFileTypes: true
    }, (err, files) => {
      if (err) throw err;
      files.forEach((item, i) => {
        if (item.isFile() && path.parse(item.name).ext === '.html') {
          fs.createReadStream(path.join(__dirname, 'components', item.name)).on('data', data => {
            string = string.replace(`{{${path.parse(item.name).name}}}`, data.toString());
            if (i === files.length - 1) {
              fs.createWriteStream(path.join(projectDist, 'index.html')).write(string);
            }
          });
        }
      });
    });
  });
}
creteHtmlPage();