import { parse } from 'url';
var locationFromUrl = function (url, as) {
    if (as === void 0) { as = url; }
    var _a = parse(as), hash = _a.hash, search = _a.search, pathname = _a.pathname;
    return {
        href: url,
        pathname: pathname || '',
        search: search || '',
        hash: hash || ''
    };
};
export default locationFromUrl;
