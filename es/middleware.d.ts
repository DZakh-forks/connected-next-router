import { SingletonRouter } from 'next/router';
import { RouterMethod } from './routerMethods';
import { Middleware } from 'redux';
export declare type RouterMethodsObject = {
    [key in RouterMethod]?: string;
};
export declare type RouterMiddlewareOpts = {
    Router?: SingletonRouter;
    methods?: RouterMethodsObject;
};
declare const createRouterMiddleware: (middlewareOpts?: RouterMiddlewareOpts) => Middleware;
export default createRouterMiddleware;
