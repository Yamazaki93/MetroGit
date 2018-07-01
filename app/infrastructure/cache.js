const fs = require('fs');
const axios = require('axios');
const homeDir = require('os').homedir();
const readLastLine = require('read-last-line');
const getSize = require('get-folder-size');
const path = require('path');
const cacheDir = `${homeDir}${path.sep}MetroGit${path.sep}cache`;

let settings;
let window;

function init(sett, win) {
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir);
    }
    settings = sett;
    window = win;
    let cleanup = settings.get('gen-cachecleanup')
    if (cleanup && cleanup !== '0') {
        setTimeout(() => {
            trimCachedFiles(Number(cleanup));
        }, 10 * 1000);
    }
}

function trimCachedFiles(sizeLimit) {
    getSize(cacheDir, (err, size) => {
        size = size / 1024 / 1024; // size in MB
        if(size > sizeLimit){
            window.webContents.send('Cache-AutoCleanBegin');
            let diff = size - sizeLimit;
            fs.readdir(cacheDir, (err, files) => {
                stats = files.map(f => {
                    return fs.statSync(cacheDir + path.sep + f)
                })
                stats.sort(function(a, b) {
                    return a.mtime.getTime() - 
                           a.mtime.getTime();
                });
                let freedSize = 0;
                let toDelete = [];
                stats.forEach((f, index) => {
                    let sz = f.size / 1024 / 1024;
                    if (freedSize < diff) {
                        freedSize += sz;
                        toDelete.push(cacheDir + path.sep + files[index]);
                    }
                });
                toDelete.forEach(file => {
                    fs.unlinkSync(file);
                })
                window.webContents.send('Cache-AutoCleanSuccess');
            })
        }
    })
}

function getCache(fileKey, lines) {
    if (!lines) {
        lines = 100;
    }
    return readLastLine.read(`${cacheDir}/${fileKey}`, lines);
}

function writeCache(fileKey, content) {
    let promise = new Promise((resolve, reject) => {
        fs.writeFile(`${cacheDir}/${fileKey}`, content, 'utf8', (err) => {
            if (err) {
                reject('FILE_WRITE_ERROR');
            } else {
                resolve();
            }
        });
    })

    return promise;
}

async function downloadFile(link, headerObj, noCache) {
    let temp = link.split('://')[1].replace(/\//g, '');
    let fileKey = `${temp}.txt`;
    let path = `${cacheDir}/${fileKey}`;
    if (fs.existsSync(path) && !noCache) {
        return getCache(`${fileKey}`, 200);
    }
    let setting = {
        method: 'GET',
        url: link,
        responseType: 'stream'
    }
    if (headerObj) {
        setting.headers = headerObj
    }
    const response = await axios(setting);

    response.data.pipe(fs.createWriteStream(path))
    return new Promise((resolve, reject) => {
        response.data.on('end', () => {
            getCache(`${fileKey}`, 200).then(content => {
                resolve(content);
            })
        })

        response.data.on('error', () => {
            reject()
        })
    })
}

module.exports = {
    init: init,
    getCache: getCache,
    writeCache: writeCache,
    downloadFile: downloadFile,
}