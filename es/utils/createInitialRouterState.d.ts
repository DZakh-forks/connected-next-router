import { RouterState, Structure } from '../types';
declare const createInitialRouterState: ({ fromJS }: Structure) => (url?: string, as?: string) => RouterState;
export default createInitialRouterState;
