"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var locationFromUrl_1 = __importDefault(require("./locationFromUrl"));
var createInitialRouterState = function (_a) {
    var fromJS = _a.fromJS;
    return function (url, as) {
        if (url === void 0) { url = '/'; }
        if (as === void 0) { as = url; }
        var initialState = {
            location: locationFromUrl_1.default(url, as),
            action: 'POP'
        };
        return fromJS(initialState);
    };
};
exports.default = createInitialRouterState;
