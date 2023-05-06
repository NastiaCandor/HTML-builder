const fs = require('fs');
const path = require('path');

const filesDir = path.join(__dirname, 'files');
const filesCopyDir = path.join(__dirname, 'files-copy');

function copyDir() {
  fs.mkdir(filesCopyDir, { recursive: true }, error => {
    if (error) console.log(error);
  });
  fs.promises.readdir(filesCopyDir)
    .then(filenames => {
      for (let filename of filenames) {
        fs.unlink(path.join(filesCopyDir,filename), err => {
          if (err) console.log(err);
        });
      }
      fs.promises.readdir(filesDir, {withFileTypes: true})
        .then(filenames => {
          for (let filename of filenames) {
            if (filename.isFile()) {
              fs.copyFile(path.join(filesDir,filename.name),path.join(filesCopyDir,filename.name), err => {
                if (err) console.log(err);
              });
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
  
}

copyDir();