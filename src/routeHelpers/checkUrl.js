function isWeb(req) {
    let url = req.headers.referer ?? "";
    if (!url) return false;
    url = url.split("/")[3]?.toLowerCase();
    return url == 'web';
}


module.exports = isWeb;