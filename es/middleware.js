import NextRouter from 'next/router';
import { PUSH, GO, PREFETCH, REPLACE } from './routerMethods';
import { CALL_ROUTER_METHOD } from './actions';
var createRouterMiddleware = function (middlewareOpts) {
    var _a;
    if (middlewareOpts === void 0) { middlewareOpts = {}; }
    var _b = middlewareOpts.Router, Router = _b === void 0 ? NextRouter : _b, _c = middlewareOpts.methods, methods = _c === void 0 ? {} : _c;
    var routerMethodsArr = [PUSH, PREFETCH, REPLACE];
    var resolvedMethods = routerMethodsArr.reduce(function (acc, method) {
        acc[method] = methods[method] ? methods[method] : method;
        return acc;
    }, (_a = {}, _a[GO] = GO, _a));
    return function () { return function (next) { return function (action) {
        var _a;
        var type = action.type, payload = action.payload;
        if (type !== CALL_ROUTER_METHOD) {
            return next(action);
        }
        var args = payload.args;
        var method = resolvedMethods[payload.method];
        if (method === GO && typeof window !== 'undefined' && typeof args[0] === 'number') {
            window.history.go(args[0]);
        }
        else if (method && Object.prototype.hasOwnProperty.call(Router, method)) {
            (_a = Router)[method].apply(_a, args);
        }
        else if (process.env.NODE_ENV === 'development') {
            throw new Error("Router method \"" + method + "\" for " + payload.method + " action does not exist");
        }
    }; }; };
};
export default createRouterMiddleware;
