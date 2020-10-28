"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = require("url");
var locationFromUrl = function (url, as) {
    if (as === void 0) { as = url; }
    var _a = url_1.parse(as), hash = _a.hash, search = _a.search, pathname = _a.pathname;
    return {
        href: url,
        pathname: pathname || '',
        search: search || '',
        hash: hash || ''
    };
};
exports.default = locationFromUrl;
