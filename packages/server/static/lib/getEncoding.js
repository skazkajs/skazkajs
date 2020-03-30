module.exports = (contentEncoding = '') => (contentEncoding.includes('deflate') ? 'deflate' : 'gzip');
