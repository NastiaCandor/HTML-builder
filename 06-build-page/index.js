const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const assetsDir = path.join(__dirname, 'assets');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');

const projectDir = path.join(__dirname, 'project-dist');
const assetsProjectDir = path.join(projectDir, 'assets');
const cssFile = fs.createWriteStream(path.join(projectDir, 'style.css'), 'utf-8');

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

async function createHtml() {
  try {
    const components = await fsPromises.readdir(componentsDir, {withFileTypes: true});

    const templateHtml = await fsPromises.readFile(path.join(__dirname, 'template.html'));
    let temp = templateHtml.toString();
    
    for (let component of components) {
      if (component.isFile() && (path.parse(component.name).ext === '.html')) {
        const compHtml = await fsPromises.readFile(path.join(componentsDir, component.name));
        temp = temp.replace(`{{${path.parse(component.name).name}}}`, compHtml.toString());
      }
    }

    // console.log(temp);
    fsPromises.writeFile(path.join(projectDir, 'index.html'), temp);
    
  } catch (err) {
    console.log(err);
  }
}

(async () => {
  await fsPromises.mkdir(projectDir, { recursive:true });

  await copyDir(assetsProjectDir, assetsDir);
  await createHtml();

  // Copying style in style.css
  const stylefiles = await fsPromises.readdir(stylesDir, {withFileTypes: true});
  for (let stylefile of stylefiles) {
    if (stylefile.isFile() && (path.parse(stylefile.name).ext === '.css')) {
      const rs = fs.createReadStream(path.join(stylesDir, stylefile.name), 'utf-8');
      let data = '';
      rs.on('data', chunk => data += chunk);
      rs.on('end', () => cssFile.write(data + '\n'));
    }
  }
  
})();