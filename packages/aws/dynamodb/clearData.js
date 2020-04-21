const clearData = (data) => JSON.parse(JSON.stringify(data).replace(/:""/g, ':null'));

module.exports = clearData;
