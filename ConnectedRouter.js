"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_redux_1 = require("react-redux");
var router_1 = __importDefault(require("next/router"));
var actions_1 = require("./actions");
var patchRouter_1 = __importDefault(require("./patchRouter"));
var locationFromUrl_1 = __importDefault(require("./utils/locationFromUrl"));
var createConnectedRouter = function (structure) {
    var getIn = structure.getIn;
    var ConnectedRouter = function (props) {
        var Router = props.Router || router_1.default;
        var _a = props.reducerKey, reducerKey = _a === void 0 ? 'router' : _a, _b = props.ignoreInitial, ignoreInitial = _b === void 0 ? false : _b;
        var store = react_redux_1.useStore();
        var ongoingRouteChanges = react_1.useRef(0);
        var isTimeTravelEnabled = react_1.useRef(false);
        var inTimeTravelling = react_1.useRef(false);
        function trackRouteComplete() {
            isTimeTravelEnabled.current = --ongoingRouteChanges.current <= 0;
        }
        function trackRouteStart() {
            isTimeTravelEnabled.current = ++ongoingRouteChanges.current <= 0;
        }
        react_1.useEffect(function () {
            if (!ignoreInitial) {
                return;
            }
            Router.ready(function () {
                store.dispatch(actions_1.onLocationChanged(locationFromUrl_1.default(Router.asPath), 'REPLACE'));
            });
        }, []);
        react_1.useEffect(function () {
            function listenStoreChanges() {
                if (!isTimeTravelEnabled.current) {
                    return;
                }
                var storeLocation = getIn(store.getState(), [reducerKey, 'location']);
                var pathnameInStore = storeLocation.pathname, searchInStore = storeLocation.search, hashInStore = storeLocation.hash, href = storeLocation.href;
                var historyLocation = locationFromUrl_1.default(Router.asPath);
                var pathnameInHistory = historyLocation.pathname, searchInHistory = historyLocation.search, hashInHistory = historyLocation.hash;
                var locationMismatch = pathnameInHistory !== pathnameInStore || searchInHistory !== searchInStore || hashInStore !== hashInHistory;
                if (locationMismatch) {
                    var as = "" + pathnameInStore + searchInStore + hashInStore;
                    inTimeTravelling.current = true;
                    Router.replace(href, as);
                }
            }
            var unsubscribeStore = store.subscribe(listenStoreChanges);
            return unsubscribeStore;
        }, [Router, store, reducerKey]);
        react_1.useEffect(function () {
            var unpatchRouter = function () { };
            function listenRouteChanges(url, as, action) {
                if (!inTimeTravelling.current) {
                    store.dispatch(actions_1.onLocationChanged(locationFromUrl_1.default(url, as), action));
                }
                else {
                    inTimeTravelling.current = false;
                }
            }
            Router.ready(function () {
                unpatchRouter = patchRouter_1.default(Router);
                Router.events.on('routeChangeStart', trackRouteStart);
                Router.events.on('routeChangeError', trackRouteComplete);
                Router.events.on('routeChangeComplete', trackRouteComplete);
                Router.events.on('connectedRouteChangeComplete', listenRouteChanges);
            });
            return function () {
                unpatchRouter();
                Router.events.off('routeChangeStart', trackRouteStart);
                Router.events.off('routeChangeError', trackRouteComplete);
                Router.events.off('routeChangeComplete', trackRouteComplete);
                Router.events.off('connectedRouteChangeComplete', listenRouteChanges);
            };
        }, [Router, reducerKey, store]);
        return react_1.default.createElement(react_1.default.Fragment, {}, props.children);
    };
    return ConnectedRouter;
};
exports.default = createConnectedRouter;
