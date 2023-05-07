const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const filesDir = path.join(__dirname, 'files');
const filesCopyDir = path.join(__dirname, 'files-copy');

async function copyDir(toCopyDir, fromCopyDir) {
  await fsPromises.mkdir(toCopyDir, { recursive:true });
  await fsPromises.rm(toCopyDir, { recursive:true });
  await fsPromises.mkdir(toCopyDir, { recursive:true });
  const filenames = await fsPromises.readdir(fromCopyDir, {withFileTypes: true});
  for (let filename of filenames) {
    if (filename.isFile()) {
      fs.copyFile(path.join(fromCopyDir,filename.name),path.join(toCopyDir,filename.name), err => {
        if (err) console.log(err);
      });
    } else {
      copyDir(path.join(toCopyDir, filename.name), path.join(fromCopyDir, filename.name));
    }
  }
}

try {
  copyDir(filesCopyDir, filesDir);
} catch (err) {
  console.log(err);
}
