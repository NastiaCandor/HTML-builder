const fs = require('fs');
const path = require('path');
const secretDir = path.join(__dirname, 'secret-folder');

fs.promises.readdir(secretDir, {withFileTypes: true})
  .then(filenames => {
    for (let filename of filenames) {
      const name = path.parse(filename.name).name;
      if (filename.isFile()) {
        fs.stat(path.join(secretDir, filename.name), (error, stats) => {
          const ext = path.parse(filename.name).ext.slice(1);
          console.log(`${name} - ${ext} - ${stats.size}b`);
        });
      }
      
    }
  })
  .catch(err => {
    console.log(err);
  });