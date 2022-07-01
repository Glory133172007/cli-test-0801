import * as core from '@actions/core';
import * as io from '@actions/io';
import * as os from 'os';
import * as tools from './execTools';

/**
 * 检查系统上是否安装了KooCLI,如果没有，会尝试进行安装，如果安装不成功，则提示安装失败，结束操作
 * @returns
 */
export async function installCLIOnSystem(): Promise<boolean> {
    const isInstalld = await checkKooCLIInstall();
    if (isInstalld) {
        await updateKooCLI();
        return true;
    }

    core.info('start install KooCLI');
    const platform = os.platform();
    installKooCLIByPlatform(platform);
    return checkKooCLIInstall();
}

/**
 * 检查KooCLI是否已经在系统上完成安装，并输出版本
 * @returns
 */
export async function checkKooCLIInstall(): Promise<boolean> {
    const kooCLI = await io.which('hcloud');
    if (!kooCLI) {
        core.info('KooCLI not installed or not set to the path');
        return false;
    }
    core.info('KooCLI already installed and set to the path');
    await tools.execCommand(`hcloud version`);
    return true;
}

/**
 * 针对不同操作系统完成KooCLI安装
 * @param platform
 * @returns
 */
export async function installKooCLIByPlatform(platform: string): Promise<void> {
    if (platform === 'darwin') {
        await installKooCLIOnMacos();
    }
    if (platform === 'linux') {
        await installKooCLIOnLinux();
    }
}

/**
 * mac系统安装KooCLI
 * @returns
 */
export async function installKooCLIOnMacos(): Promise<void> {
    core.info('current system is MacOS.');
    await tools.execCommand(
        'curl -sSL https://hwcloudcli.obs.cn-north-1.myhuaweicloud.com/cli/latest/hcloud_install.sh -o ./hcloud_install.sh && bash ./hcloud_install.sh -y'
    );
}

/**
 * 在当前的linux系统上安装KooCLI
 * KooCLI支持Linux AMD 64位 和 ARM 64位操作系统
 * @returns
 */
export async function installKooCLIOnLinux(): Promise<void> {
    core.info('current system is Linux.');
    await tools.execCommand(
        'curl -sSL https://hwcloudcli.obs.cn-north-1.myhuaweicloud.com/cli/latest/hcloud_install.sh -o ./hcloud_install.sh && bash ./hcloud_install.sh -y'
    );
}

/**
 * 配置KooCLI
 * @returns
 */
export async function configureKooCLI(ak: string, sk: string, region?: string): Promise<boolean> {
    core.info('start configure KooCLI.');
    const args = [`--cli-access-key=${ak}`, `--cli-secret-key=${sk}`];
    if (region) {
        args.push(`--cli-region=${region}`);
    }
    args.push;
    return await tools.execCommand(`hcloud configure set`, args);
}

/**
 * 更新KooCLI
 * 版本3.2.8之后，更新版本时有关于统计访问量的交互，通过配置环境变量跳过
 * @returns
 */
export async function updateKooCLI(): Promise<void> {
    core.info('try update KooCLI.');
    await tools.execCommand('export STACK=hcloud-toolkit');
    await tools.execCommand('hcloud update -y');
}
