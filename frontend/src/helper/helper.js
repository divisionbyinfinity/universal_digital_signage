exports.getCurrentPage=function(data, page, limit=10) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return data.slice(startIndex, endIndex);
}
exports.getRandomId=function() {
    return Math.floor(Math.random() * 1000);
}
