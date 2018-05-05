function isSSH(url) {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return false;
    } else {
        return true;
    }
}

module.exports = {
    isSSH: isSSH
}