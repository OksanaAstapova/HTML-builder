const fs = require('fs');
const path = require('path');
const projectDist = path.join(__dirname, 'project-dist');
const styles = path.join(__dirname, 'styles');
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
      const fileOld = path.join(assetsOld, file.name);
      const fileNew = path.join(assetsNew, file.name);
      await fs.promises.copyFile(fileOld, fileNew);
    } else {
      copyDir(path.join(assetsOld, file.name), path.join(assetsNew, file.name));
    }
  });
}
copyDir(assetsOld, assetsNew);

fs.readdir(styles, (err, files) => {
  const fileCss = fs.createWriteStream(path.join(projectDist, 'style.css'));
  if (err) throw err;
  for (let i = 0; i < files.length; i++) {
    let extension = path.extname(files[i]).split('.').pop();
    if (extension === 'css') {
      const input = fs.createReadStream(path.join(styles, files[i]));
      input.on('data', data => {
        fileCss.write(data.toString() + '\n');
      });
    }
  }
});

async function creteHtmlPage() {
  const htmlFile = fs.createWriteStream(path.join(projectDist, 'index.html'));
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