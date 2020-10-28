import React, { useEffect, useRef } from 'react';
import { useStore } from 'react-redux';
import NextRouter from 'next/router';
import { onLocationChanged } from './actions';
import patchRouter from './patchRouter';
import locationFromUrl from './utils/locationFromUrl';
var createConnectedRouter = function (structure) {
    var getIn = structure.getIn;
    var ConnectedRouter = function (props) {
        var Router = props.Router || NextRouter;
        var _a = props.reducerKey, reducerKey = _a === void 0 ? 'router' : _a, _b = props.ignoreInitial, ignoreInitial = _b === void 0 ? false : _b;
        var store = useStore();
        var ongoingRouteChanges = useRef(0);
        var isTimeTravelEnabled = useRef(false);
        var inTimeTravelling = useRef(false);
        function trackRouteComplete() {
            isTimeTravelEnabled.current = --ongoingRouteChanges.current <= 0;
        }
        function trackRouteStart() {
            isTimeTravelEnabled.current = ++ongoingRouteChanges.current <= 0;
        }
        useEffect(function () {
            if (!ignoreInitial) {
                return;
            }
            Router.ready(function () {
                store.dispatch(onLocationChanged(locationFromUrl(Router.asPath), 'REPLACE'));
            });
        }, []);
        useEffect(function () {
            function listenStoreChanges() {
                if (!isTimeTravelEnabled.current) {
                    return;
                }
                var storeLocation = getIn(store.getState(), [reducerKey, 'location']);
                var pathnameInStore = storeLocation.pathname, searchInStore = storeLocation.search, hashInStore = storeLocation.hash, href = storeLocation.href;
                var historyLocation = locationFromUrl(Router.asPath);
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
        useEffect(function () {
            var unpatchRouter = function () { };
            function listenRouteChanges(url, as, action) {
                if (!inTimeTravelling.current) {
                    store.dispatch(onLocationChanged(locationFromUrl(url, as), action));
                }
                else {
                    inTimeTravelling.current = false;
                }
            }
            Router.ready(function () {
                unpatchRouter = patchRouter(Router);
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
        return React.createElement(React.Fragment, {}, props.children);
    };
    return ConnectedRouter;
};
export default createConnectedRouter;
