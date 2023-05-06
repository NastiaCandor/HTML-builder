const fs = require('fs');
const path = require('path');
const secretDir = path.join(__dirname, 'secret-folder');

fs.promises.readdir(secretDir, {withFileTypes: true})
  .then(filenames => {
    for (let filename of filenames) {
      const name = path.parse(filename.name).name;
      fs.stat(path.join(secretDir, filename.name), (error, stats) => {
        if (stats.isFile()) {
          const ext = path.parse(filename.name).ext.slice(1);
          console.log(`${name} - ${ext} - ${stats.size}b`);
        }
      });
    }
  })
  // If promise is rejected
  .catch(err => {
    console.log(err);
  });