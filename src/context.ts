import * as core from '@actions/core';

export const LINUX_KOOCLI_MOD = '755'
export interface Inputs {
    accessKey: string;
    secretKey: string;
    region: string;
    commandList: string[];
}

export function getInputs(): Inputs {
    return {
        accessKey: core.getInput('access_key'),
        secretKey: core.getInput('secret_key'),
        region: core.getInput('region'),
        commandList: core.getMultilineInput('command_list'),
    };
}
