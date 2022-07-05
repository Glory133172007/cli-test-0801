import * as core from '@actions/core';

export const LINUX_KOOCLI_MOD = '755';
export const WINDOWS_KOOCLI_PATH = 'C:/windows/hcloud';
export const LINUX_KOOCLI_PATH = '/usr/hcloud';
export const MACOS_KOOCLI_URL = 'https://hwcloudcli.obs.cn-north-1.myhuaweicloud.com/cli/latest/hcloud_install.sh';
export const WINDOWS_KOOCLI_URL =
    'https://hwcloudcli.obs.cn-north-1.myhuaweicloud.com/cli/latest/huaweicloud-cli-windows-amd64.zip';
export const LINUX_ARM_KOOCLI_URL =
    'https://hwcloudcli.obs.cn-north-1.myhuaweicloud.com/cli/latest/huaweicloud-cli-linux-arm64.tar.gz';
export const LINUX_ARM_KOOCLI_PACKAGE_NAME = 'huaweicloud-cli-linux-arm64.tar.gz';
export const LINUX_AMD_KOOCLI_URL =
    'https://hwcloudcli.obs.cn-north-1.myhuaweicloud.com/cli/latest/huaweicloud-cli-linux-amd64.tar.gz';
export const LINUX_AMD_KOOCLI_PACKAGE_NAME = 'huaweicloud-cli-linux-amd64.tar.gz';

export interface Inputs {
    accessKey: string;
    secretKey: string;
    region: string;
    commandList: string[];
}

export function getInputs(): Inputs {
    return {
        accessKey: core.getInput('access_key', { required: true }),
        secretKey: core.getInput('secret_key', { required: true }),
        region: core.getInput('region', { required: false }),
        commandList: core.getMultilineInput('command_list', { required: false }),
    };
}
