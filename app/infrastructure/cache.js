const fs = require('fs');
const axios = require('axios');
const homeDir = require('os').homedir();
const cacheDir = homeDir + '/MetroGit/cache';
const readLastLine = require('read-last-line');


function init() {
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir);
    }
}

function getCache(fileKey, lines) {
    if(!lines) {
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