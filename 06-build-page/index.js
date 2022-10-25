const fs = require('node:fs');
const path = require('node:path');


const projectDist = path.resolve(__dirname, 'project-dist');
const assetsDir = path.resolve(__dirname, 'project-dist/assets');
const stylesFile = path.resolve(__dirname, 'project-dist/style.css');
const htmlFile = path.resolve(__dirname, 'project-dist/index.html');

fs.mkdir(projectDist, { recursive: true }, (err) => {
    if (err) console.log(err);
})

fs.mkdir(assetsDir, { recursive: true }, (err) => {
    if (err) console.log(err);
})

fs.writeFile(stylesFile, '', (err) => {
    if (err) console.log(err);
})

fs.readdir(path.resolve(__dirname, 'assets'), { withFileTypes: true }, (_, dirs) => {
    for (let dir of dirs) {
        fs.mkdir(path.join(assetsDir, `${dir.name}`), { recursive: true }, (err) => {
            console.log(err);
        });
        fs.readdir(path.join(assetsDir, `${dir.name}`), { withFileTypes: true }, (_, files) => {
            for (let file of files) {
                fs.unlink(path.join(assetsDir, `${dir.name}`, `${file.name}`), (err) => {
                    if (err) console.log(err);
                })

            }
        });

        fs.readdir(path.resolve(__dirname, `assets/${dir.name}`), { withFileTypes: true }, (_, files) => {
            for (let file of files) {
                fs.copyFile(path.resolve(__dirname, `assets/${dir.name}/${file.name}`),
                    path.resolve(assetsDir, `${dir.name}/${file.name}`), (ee) => {
                        if (ee) console.log(err);
                    }
                );
            }
        })
    }
});

fs.readdir(path.resolve(__dirname, 'styles'), { withFileTypes: true }, (_, files) => {
    for (let file of files) {
        if (file.isFile() && path.extname(file.name) === '.css') {
            fs.readFile(path.resolve(__dirname, `styles/${file.name}`), (ee, data) => {
                fs.appendFile(stylesFile, data, (e) => {
                    if (e) console.log(e);
                })
            })
        }
    }
});

fs.readdir(path.resolve(__dirname, 'components'), { withFileTypes: true }, (_, files) => {
    let text = '';
    fs.readFile(path.resolve(__dirname, 'template.html'), { encoding: 'utf-8' }, (ee, data) => {
        text = data;
    });
    for (let file of files) {
        if (file.isFile() && path.extname(file.name) === '.html') {
            fs.readFile(path.join(__dirname, 'components', `${file.name}`), { encoding: 'utf-8' }, (ee, data) => {
                text = text.replace(`{{${file.name.split('.')[0]}}}`, `${data}`);
                fs.writeFile(htmlFile, text, (err) => {
                    if (err) console.log(err);
                })
            });
        }
    }

});

