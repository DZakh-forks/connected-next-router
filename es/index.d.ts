/// <reference types="react" />
export { LOCATION_CHANGE, CALL_ROUTER_METHOD, routerActions, push, replace, go, goBack, goForward, prefetch, } from './actions';
export { default as routerMethods } from './routerMethods';
export { default as createRouterMiddleware } from './middleware';
export declare const initialRouterState: (url?: string, as?: string) => import("./types").RouterState;
export declare const routerReducer: import("redux").Reducer<import("./types").RouterState, import("redux").AnyAction | import("./actions").LocationChangeAction>;
export declare const ConnectedRouter: import("react").FC<{
    children?: import("react").ReactNode;
    reducerKey?: string | undefined;
    ignoreInitial?: boolean | undefined;
    Router?: import("next/router").SingletonRouter | undefined;
}>;
