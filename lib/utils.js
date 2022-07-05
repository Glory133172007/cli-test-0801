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
exports.checkCommand = exports.checkParameterIsNull = exports.checkRegion = exports.checkAkSk = exports.checkInputs = void 0;
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
    if (!checkRegion(inputs.region)) {
        core.setFailed('region is not correct.');
        return false;
    }
    if (inputs.commandList.length > 0) {
        inputs.commandList.forEach((command) => {
            if (!checkCommand(command)) {
                core.setFailed(`your command: ${command} is not correct.`);
                return false;
            }
        });
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
const akReg = /^[a-zA-Z0-9]{10,30}$/;
const skReg = /^[a-zA-Z0-9]{30,50}$/;
function checkAkSk(ak, sk) {
    return akReg.test(ak) && skReg.test(sk);
}
exports.checkAkSk = checkAkSk;
/**
 * 检查region格式是否合法
 * @returns
 */
const regionReg = /^[a-z]{2}-[a-z]+-[1-9]$/;
function checkRegion(region) {
    return regionReg.test(region);
}
exports.checkRegion = checkRegion;
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
 * 判断操作命令是否合法
 * @param command
 * @returns
 */
function checkCommand(command) {
    if (checkParameterIsNull(command)) {
        core.info(`command should not be empty.`);
        return false;
    }
    if (!command.startsWith('hcloud')) {
        core.info('command should start with "hcloud", please check your command.');
        return false;
    }
    return true;
}
exports.checkCommand = checkCommand;
//# sourceMappingURL=utils.js.map