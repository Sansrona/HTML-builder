const fs = require('node:fs');
const fsPromise = require('node:fs/promises');
const path = require('node:path');


const projectDist = path.resolve(__dirname, 'project-dist');
const assetsDir = path.join(projectDist, 'assets');
const stylesFile = path.join(projectDist, 'style.css');
const htmlFile = path.join(projectDist, 'index.html');

async function clearDir(dir) {
    console.log(dir);
    let files = await fsPromise.readdir(dir);
    for (let file of files) {
        let filePath = path.join(dir, file);
        let stat = await fsPromise.stat(filePath);
        if (stat.isFile()) {
            await fsPromise.unlink(filePath);
        } else {
            await clearDir(filePath);
            await fsPromise.rmdir(filePath);
        }
    }
}

async function copyDir(targetDir, newDir) {
    await fsPromise.mkdir(newDir, { recursive: true });
    let files = await fsPromise.readdir(targetDir);
    for (let file of files) {
        let filePath = path.join(targetDir, file);
        let stat = await fsPromise.stat(filePath);
        if (stat.isFile()) {
            await fsPromise.copyFile(path.join(targetDir, file), path.join(newDir, file));
        } else {
            await copyDir(path.join(targetDir, file), path.join(newDir, file));
        }
    }
}

async function createPage() {
    await fsPromise.mkdir(projectDist, { recursive: true});
    await clearDir(projectDist);
    await copyDir(path.join(__dirname, 'assets'), assetsDir);

    let writeStream = fs.createWriteStream(stylesFile);
    let cssFiles = await fsPromise.readdir(path.resolve(__dirname, 'styles'));
    for (let file of cssFiles) {
        if (path.extname(file) === '.css') {
            let readStream = fs.createReadStream(path.join(__dirname, 'styles', file), 'utf8');
            readStream.on('data', (chunk) => {
                writeStream.write(chunk + '\n');
            })
        }
    }

    await fsPromise.copyFile(path.join(__dirname, 'template.html'), htmlFile);

    let htmlText = await fsPromise.readFile(htmlFile, 'utf8');
    let htmlFiles = await fsPromise.readdir(path.resolve(__dirname, 'components'));
    for (let file of htmlFiles) {
        if (path.extname(file) === '.html') {
            let readStream = fs.createReadStream(path.join(__dirname, 'components', file), 'utf8');
            readStream.on('data', (chunk) => {
                htmlText = htmlText.replace(`{{${file.split('.')[0]}}}`, chunk);
                let writeStream = fs.createWriteStream(htmlFile);
                writeStream.write(htmlText);
            })
        }
    }
}

createPage();





