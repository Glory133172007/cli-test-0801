import * as core from '@actions/core';
import * as context from './context';
import * as tools from './execTools';
import * as install from './install';
import * as utils from './utils';

export async function run() {
    const inputs: context.Inputs = context.getInputs();

    // 如果参数输入有问题，终止操作
    if (!utils.checkInputs(inputs)) {
        return;
    }

    // 检查当前环境是否具备远程命令操作条件
    const isInstallSuccess = await install.installCLIOnSystem();
    if (!isInstallSuccess) {
        core.setFailed('can not install KooCLI on system.');
        return;
    }

    // 配置KooCLI
    const isConfigSuccess = await install.configureKooCLI(inputs.accessKey, inputs.secretKey, inputs?.region);

    //执行远程操作
    if (isConfigSuccess) {
        for (const command of inputs.commandList) {
            if (!utils.checkParameterIsNull(command)) {
                await tools.execCommand(command);
            }
        }
    } else {
        core.setFailed('configure failed.');
        return;
    }
}

run();
