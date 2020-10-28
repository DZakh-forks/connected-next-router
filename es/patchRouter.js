import { formatWithValidation } from 'next/dist/next-server/lib/utils';
var patchRouter = function (Router) {
    function change(method, _url, _as, options, action) {
        var url = typeof _url === 'object' ? formatWithValidation(_url) : _url;
        var as = typeof _as === 'object' ? formatWithValidation(_as) : _as;
        return Router.router.change(method, _url, _as, options).then(function (changeResult) {
            var _a;
            if (changeResult) {
                if (process.env.__NEXT_EXPORT_TRAILING_SLASH) {
                    var rewriteUrlForNextExport = require('./utils/rewriteUrlForExport').rewriteUrlForNextExport;
                    if (__NEXT_DATA__.nextExport) {
                        as = rewriteUrlForNextExport(as);
                    }
                }
                (_a = Router === null || Router === void 0 ? void 0 : Router.router) === null || _a === void 0 ? void 0 : _a.events.emit('connectedRouteChangeComplete', url, as, action);
            }
            return changeResult;
        });
    }
    var unpatchedMethods = {
        replace: Router.router.replace,
        push: Router.router.push,
        bpsCallback: Router.router._bps,
        beforePopState: Router.beforePopState
    };
    Router.router.replace = function (url, as, options) {
        if (as === void 0) { as = url; }
        if (options === void 0) { options = {}; }
        return change('replaceState', url, as, options, 'REPLACE');
    };
    Router.router.push = function (url, as, options) {
        if (as === void 0) { as = url; }
        if (options === void 0) { options = {}; }
        return change('pushState', url, as, options, 'PUSH');
    };
    Router.beforePopState(function (state) {
        var url = state.url, as = state.as, options = state.options;
        change('replaceState', url, as, options, 'POP');
        if (unpatchedMethods.bpsCallback) {
            unpatchedMethods.bpsCallback(state);
        }
        return false;
    });
    Router.beforePopState = function (cb) {
        unpatchedMethods.bpsCallback = cb;
    };
    return function () {
        Router.router.replace = unpatchedMethods.replace;
        Router.router.push = unpatchedMethods.push;
        Router.beforePopState = unpatchedMethods.beforePopState;
        if (unpatchedMethods.bpsCallback) {
            Router.beforePopState(unpatchedMethods.bpsCallback);
        }
    };
};
export default patchRouter;
