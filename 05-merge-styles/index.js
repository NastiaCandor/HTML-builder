const fs = require('fs');
const path = require('path');

const filesDir = path.join(__dirname, 'styles');
const projectDir = path.join(__dirname, 'project-dist');
const bundle = fs.createWriteStream(path.join(projectDir, 'bundle.css'), 'utf-8');

fs.promises.readdir(filesDir, {withFileTypes: true})
  .then(filenames => {
    for (let filename of filenames) {
      if (filename.isFile() && (path.parse(filename.name).ext === '.css')) {
        const rs = fs.createReadStream(path.join(filesDir, filename.name), 'utf-8');
        let data = '';
        rs.on('data', chunk => data += chunk);
        rs.on('end', () => bundle.write(data + '\n'));
      }
      
    }
  })
  .catch(err => {
    console.log(err);
  });