import * as core from '@actions/core';
import * as io from '@actions/io';
import * as tc from '@actions/tool-cache';
import * as fs from 'fs';
import * as os from 'os';
import * as tools from './execTools';
import * as utils from './utils';
import {
    LINUX_KOOCLI_MOD,
    WINDOWS_KOOCLI_PATH,
    LINUX_KOOCLI_PATH,
    MACOS_KOOCLI_URL,
    WINDOWS_KOOCLI_URL,
    LINUX_ARM_KOOCLI_URL,
    LINUX_ARM_KOOCLI_PACKAGE_NAME,
    LINUX_AMD_KOOCLI_URL,
    LINUX_AMD_KOOCLI_PACKAGE_NAME,
} from './context';

/**
 * 检查系统上是否安装了KooCLI，如果没有，会尝试进行安装，如果安装不成功，则提示安装失败，结束操作
 * @returns
 */
export async function installCLIOnSystem(): Promise<boolean> {
    // 设置环境变量STACK，跳过使用hcloud的用户隐私交互
    core.exportVariable('STACK', 'hcloud-toolkit');
    core.info('start install KooCLI');
    const platform = os.platform();
    await installKooCLIByPlatform(platform);
    return checkKooCLIInstall();
}

/**
 * 检查KooCLI是否已经在系统上完成安装，并输出版本
 * @returns
 */
export async function checkKooCLIInstall(): Promise<boolean> {
    const kooCLI = await io.which('hcloud');
    if (!kooCLI) {
        core.info('KooCLI is not installed or is not set to the PATH.');
        return false;
    }
    core.info('KooCLI is installed and is set to the PATH');
    await tools.execCommand(`${kooCLI} version`);
    return true;
}

/**
 * 针对不同操作系统完成KooCLI安装
 * @param platform
 */
export async function installKooCLIByPlatform(platform: string): Promise<void> {
    if (platform === 'darwin') {
        await installKooCLIOnMacos();
    }
    if (platform === 'linux') {
        await installKooCLIOnLinux();
    }
    if (platform === 'win32') {
        await installCLLIOnWindows();
    }
}

/**
 * mac系统安装KooCLI
 */
export async function installKooCLIOnMacos(): Promise<void> {
    core.info('current system is MacOS.');
    await tools.execCommand(`curl -sSL ${MACOS_KOOCLI_URL} -o ./hcloud_install.sh && bash ./hcloud_install.sh -y`);
}

/**
 * 在当前的linux系统上安装KooCLI
 * KooCLI支持Linux AMD 64位 和 ARM 64位操作系统
 */
export async function installKooCLIOnLinux(): Promise<void> {
    core.info('current system is Linux.');

    const hostType = os.arch();
    const downloadInfo = getLinuxKooCLIDownloadInfo(hostType);
    if (utils.checkParameterIsNull(downloadInfo.url) || utils.checkParameterIsNull(downloadInfo.packageName)) {
        core.info(`KooCLI can be run on Linux AMD64 or Linux Arm64, your system is ${hostType}.`);
        return;
    }

    await tools.execCommand(`sudo mkdir -p ${LINUX_KOOCLI_PATH}`);
    fs.chmodSync(LINUX_KOOCLI_PATH, LINUX_KOOCLI_MOD);

    await tools.execCommand(`curl -LO ${downloadInfo.url}`);

    core.info(`extract KooCLI to ${LINUX_KOOCLI_PATH}`);
    await tools.execCommand(`tar -zxvf ${downloadInfo.packageName} -C ${LINUX_KOOCLI_PATH}`);
    core.addPath(LINUX_KOOCLI_PATH);
}

/**
 * 在当前的windows系统上安装KooCLI
 */
export async function installCLLIOnWindows(): Promise<void> {
    core.info('current system is Windows.');

    fs.mkdirSync(WINDOWS_KOOCLI_PATH);
    const cliPath = await tc.downloadTool(WINDOWS_KOOCLI_URL, WINDOWS_KOOCLI_PATH);
    const cliExtractedFolder = await tc.extractZip(cliPath, WINDOWS_KOOCLI_PATH);
    core.addPath(cliExtractedFolder);
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
 */
export async function updateKooCLI(): Promise<void> {
    core.info('try to update KooCLI.');
    await tools.execCommand('hcloud update -y');
}

/**
 * 根据linux操作系统获得cli下载地址和包名，目前linux支持Linux AMD 64位 和 ARM 64位操作系统
 * @param hostType
 * @returns
 */
function getLinuxKooCLIDownloadInfo(hostType: string): {
    url: string;
    packageName: string;
} {
    const downloadInfo = {
        url: '',
        packageName: '',
    };
    if (hostType === 'aarch64') {
        downloadInfo.url = LINUX_ARM_KOOCLI_URL;
        downloadInfo.packageName = LINUX_ARM_KOOCLI_PACKAGE_NAME;
    }
    if (hostType === 'x86_64') {
        downloadInfo.url = LINUX_AMD_KOOCLI_URL;
        downloadInfo.packageName = LINUX_AMD_KOOCLI_PACKAGE_NAME;
    }
    return downloadInfo;
}
