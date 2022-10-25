const fs = require('node:fs');
const path = require('node:path');

const secretFolder = path.resolve(__dirname, 'secret-folder');
const files = fs.readdir(secretFolder, { withFileTypes: true }, (_, files) => {
    for (const file of files) {
        const filePath = path.resolve(__dirname, `secret-folder/${file.name}`);
        if (file.isFile()) {
            fs.stat(filePath, (err, stats) => {
                console.log(path.basename(file.name, path.extname(file.name)) + ' - ' + path.extname(file.name).replace('.', '') + ' - ' + stats.size + ' bytes');
            })
        }
    }
});

