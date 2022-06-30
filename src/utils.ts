import * as core from '@actions/core';
import * as context from './context';

/**
 * 检查输入的各参数是否正常
 * @param inputs
 * @returns
 */
export function checkInputs(inputs: context.Inputs): boolean {
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

/**
 * 检查ak/sk是否合法
 * @param ak
 * @param sk
 * @returns
 */
export function checkAkSk(ak: string, sk: string): boolean {
    const akReg = /^[a-zA-Z0-9]{10,30}$/;
    const skReg = /^[a-zA-Z0-9]{30,50}$/;
    return akReg.test(ak) && skReg.test(sk);
}

/**
 * 判断字符串是否为空
 * @param parameter
 * @returns
 */
export function checkParameterIsNull(parameter: string): boolean {
    return parameter === '' || parameter.trim().length === 0;
}

/**
 * 判断操作命令列表是否为空
 * @param command_list
 * @returns
 */
export function checkCommandIsNull(command_list: string[]): boolean {
    return command_list.length > 0;
}
