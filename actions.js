"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerActions = exports.goForward = exports.goBack = exports.prefetch = exports.go = exports.replace = exports.push = exports.CALL_ROUTER_METHOD = exports.onLocationChanged = exports.LOCATION_CHANGE = void 0;
var routerMethods_1 = require("./routerMethods");
exports.LOCATION_CHANGE = '@@router/LOCATION_CHANGE';
exports.onLocationChanged = function (location, action) { return ({
    type: exports.LOCATION_CHANGE,
    payload: {
        location: location,
        action: action
    }
}); };
exports.CALL_ROUTER_METHOD = '@@router/CALL_ROUTER_METHOD';
exports.push = function (url, as, options) { return ({
    type: exports.CALL_ROUTER_METHOD,
    payload: {
        method: routerMethods_1.PUSH,
        args: [url, as, options]
    }
}); };
exports.replace = function (url, as, options) { return ({
    type: exports.CALL_ROUTER_METHOD,
    payload: {
        method: routerMethods_1.REPLACE,
        args: [url, as, options]
    }
}); };
exports.go = function (number) { return ({
    type: exports.CALL_ROUTER_METHOD,
    payload: {
        method: routerMethods_1.GO,
        args: [number]
    }
}); };
exports.prefetch = function (url) { return ({
    type: exports.CALL_ROUTER_METHOD,
    payload: {
        method: routerMethods_1.PREFETCH,
        args: [url]
    }
}); };
exports.goBack = function () { return exports.go(-1); };
exports.goForward = function () { return exports.go(1); };
exports.routerActions = { push: exports.push, replace: exports.replace, go: exports.go, goBack: exports.goBack, goForward: exports.goForward, prefetch: exports.prefetch };
