import locationFromUrl from './locationFromUrl';
var createInitialRouterState = function (_a) {
    var fromJS = _a.fromJS;
    return function (url, as) {
        if (url === void 0) { url = '/'; }
        if (as === void 0) { as = url; }
        var initialState = {
            location: locationFromUrl(url, as),
            action: 'POP'
        };
        return fromJS(initialState);
    };
};
export default createInitialRouterState;
