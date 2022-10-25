const fs = require('node:fs');
const path = require('node:path');
const fsPromise = require('node:fs/promises');
const filesDir = path.resolve(__dirname, 'files');
const filesCopyDir = path.resolve(__dirname, 'files-copy');

fs.mkdir(filesCopyDir, { recursive: true }, (ee) => {
});

fs.readdir(filesCopyDir, { withFileTypes: true }, (_, files) => {
    for (let file of files) {
        fsPromise.unlink(`${filesCopyDir}/${file.name}`, (err) => {
            if (err) console.log(err);
            else console.log('Файл удален')
        })
    }
})

fs.readdir(filesDir, { withFileTypes: true }, (_, files) => {
    for (const file of files) {
        fsPromise.copyFile(`${filesDir}/${file.name}`, `${filesCopyDir}/${file.name}`)
    }
});
