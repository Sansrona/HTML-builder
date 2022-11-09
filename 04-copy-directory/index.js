const path = require('path');
const fsPromise = require('fs/promises');


const filesDir = path.join(__dirname, 'files');
const filesCopyDir = path.join(__dirname, 'files-copy');



async function clear(folder) {
    let files = await fsPromise.readdir(folder);
    for (let file of files) {
        let stat = await fsPromise.stat(path.join(filesCopyDir, file));
        if (stat.isFile()) {
            await fsPromise.unlink(path.join(filesCopyDir, file));
        } else {
            await clear(path.join(filesCopyDir, file));
            await fsPromise.rmdir(path.join(filesCopyDir, file))
        }

    }
}

async function finishHIM() {
    await fsPromise.mkdir(filesCopyDir, { recursive: true });
    await clear(filesCopyDir);

    let files = await fsPromise.readdir(filesDir);
    for (const file of files) {
        console.log('Путь: ', path.join(filesDir, file));
        await fsPromise.copyFile(path.join(filesDir, file), path.join(filesCopyDir, file))

    }

}

finishHIM()