const fs = require('node:fs');
const path = require('node:path');

const target = path.resolve(__dirname, 'project-dist');

fs.writeFile(target, 'bundle.css', (err) => {
    if (err) console.error(err);
});

fs.readdir(path.resolve(__dirname, 'styles'), { withFileTypes: true }, (_, files) => {
    for (let file of files) {
        if (file.isFile() && path.extname(file.name) === '.css') {
            fs.readFile(path.resolve(__dirname, `styles/${file.name}`), (ee, data) => {
                fs.appendFile(`${target}/bundle.css`, data, (e) => {
                    if (e) console.log(e);
                })
            })
        }
    }
})