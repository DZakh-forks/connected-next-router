import { SingletonRouter, Router } from 'next/router';
declare type RouterToPatch = SingletonRouter & {
    router: Router;
};
declare const patchRouter: (Router: RouterToPatch) => (() => void);
export default patchRouter;
