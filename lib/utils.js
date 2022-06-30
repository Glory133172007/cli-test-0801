"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCommandIsNull = exports.checkParameterIsNull = exports.checkAkSk = exports.checkInputs = void 0;
const core = __importStar(require("@actions/core"));
/**
 * 检查输入的各参数是否正常
 * @param inputs
 * @returns
 */
function checkInputs(inputs) {
    if (!checkAkSk(inputs.accessKey, inputs.secretKey)) {
        core.setFailed('ak or sk is not correct.');
        return false;
    }
    if (!checkCommandIsNull(inputs.commandList)) {
        core.setFailed('enter at least one command.');
        return false;
    }
    return true;
}
exports.checkInputs = checkInputs;
/**
 * 检查ak/sk是否合法
 * @param ak
 * @param sk
 * @returns
 */
function checkAkSk(ak, sk) {
    const akReg = /^[a-zA-Z0-9]{10,30}$/;
    const skReg = /^[a-zA-Z0-9]{30,50}$/;
    return akReg.test(ak) && skReg.test(sk);
}
exports.checkAkSk = checkAkSk;
/**
 * 判断字符串是否为空
 * @param parameter
 * @returns
 */
function checkParameterIsNull(parameter) {
    return parameter === '' || parameter.trim().length === 0;
}
exports.checkParameterIsNull = checkParameterIsNull;
/**
 * 判断操作命令列表是否为空
 * @param command_list
 * @returns
 */
function checkCommandIsNull(command_list) {
    return command_list.length > 0;
}
exports.checkCommandIsNull = checkCommandIsNull;
//# sourceMappingURL=utils.js.map