const fs = require('fs');
const path = require('path');
const styles = path.join(__dirname, 'styles');
const projectDist = path.join(__dirname, 'project-dist');
const merge = fs.createWriteStream(path.join(projectDist, 'bundle.css'));

fs.readdir(styles, (err, files) => {
  if (err) throw err;
  for (let i = 0; i < files.length; i++) {
      let file = files[i];
    if (path.extname(file).split('.').pop() === 'css') {
        fs.createReadStream(path.join(styles, file)).on('data', data => {
        merge.write(data.toString() + '\n');
      });
    }
  }
});
