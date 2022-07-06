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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateKooCLI = exports.configureKooCLI = exports.installCLLIOnWindows = exports.installKooCLIOnLinux = exports.installKooCLIOnMacos = exports.installKooCLIByPlatform = exports.checkKooCLIInstall = exports.installCLIOnSystem = void 0;
const core = __importStar(require("@actions/core"));
const io = __importStar(require("@actions/io"));
const tc = __importStar(require("@actions/tool-cache"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const tools = __importStar(require("./execTools"));
const utils = __importStar(require("./utils"));
const context = __importStar(require("./context"));
/**
 * 检查系统上是否安装了KooCLI，如果没有，会尝试进行安装，如果安装不成功，则提示安装失败，结束操作
 * @returns
 */
function installCLIOnSystem() {
    return __awaiter(this, void 0, void 0, function* () {
        // 设置环境变量STACK，跳过使用hcloud的用户隐私交互
        core.exportVariable('STACK', 'hcloud-toolkit');
        core.info('start install KooCLI');
        const platform = os.platform();
        yield installKooCLIByPlatform(platform);
        return checkKooCLIInstall();
    });
}
exports.installCLIOnSystem = installCLIOnSystem;
/**
 * 检查KooCLI是否已经在系统上完成安装并成功设置PATH
 * @returns
 */
function checkKooCLIInstall() {
    return __awaiter(this, void 0, void 0, function* () {
        const kooCLI = yield io.which('hcloud');
        if (!kooCLI) {
            core.info('KooCLI is not installed or is not set to the PATH.');
            return false;
        }
        core.info('KooCLI is installed and is set to the PATH');
        yield tools.execCommand(`${kooCLI} version`);
        return true;
    });
}
exports.checkKooCLIInstall = checkKooCLIInstall;
/**
 * 针对不同操作系统完成KooCLI安装
 * @param platform
 */
function installKooCLIByPlatform(platform) {
    return __awaiter(this, void 0, void 0, function* () {
        if (platform === 'darwin') {
            yield installKooCLIOnMacos();
        }
        if (platform === 'linux') {
            yield installKooCLIOnLinux();
        }
        if (platform === 'win32') {
            yield installCLLIOnWindows();
        }
    });
}
exports.installKooCLIByPlatform = installKooCLIByPlatform;
/**
 * MacOS系统安装KooCLI
 * KooCLI支持MacOS AMD 64位 和 ARM 64位操作系统
 */
function installKooCLIOnMacos() {
    return __awaiter(this, void 0, void 0, function* () {
        core.info('current system is MacOS.');
        const hostType = yield tools.getExecResult('uname -a');
        const downloadInfo = getMacOSKooCLIDownloadInfo(hostType);
        if (utils.checkParameterIsNull(downloadInfo.url) || utils.checkParameterIsNull(downloadInfo.packageName)) {
            core.info(`KooCLI can be run on MacOS AMD64 or MacOS Arm64, your system is ${hostType}.`);
            return;
        }
        yield installKooCLIOnLinuxAndMacOS(context.LINUX_MACOS_KOOCLI_PATH, downloadInfo.packageName, downloadInfo.url, context.KOOCLI_MOD);
    });
}
exports.installKooCLIOnMacos = installKooCLIOnMacos;
/**
 * 在当前的linux系统上安装KooCLI
 * KooCLI支持Linux AMD 64位 和 ARM 64位操作系统
 */
function installKooCLIOnLinux() {
    return __awaiter(this, void 0, void 0, function* () {
        core.info('current system is Linux.');
        const hostType = yield tools.getExecResult('echo $HOSTTYPE');
        const downloadInfo = getLinuxKooCLIDownloadInfo(hostType);
        if (utils.checkParameterIsNull(downloadInfo.url) || utils.checkParameterIsNull(downloadInfo.packageName)) {
            core.info(`KooCLI can be run on Linux AMD64 or Linux Arm64, your system is ${hostType}.`);
            return;
        }
        yield installKooCLIOnLinuxAndMacOS(context.LINUX_MACOS_KOOCLI_PATH, downloadInfo.packageName, downloadInfo.url, context.KOOCLI_MOD);
    });
}
exports.installKooCLIOnLinux = installKooCLIOnLinux;
/**
 * 在Linux和MacOS上创建目录，获取权限，安装KooCLI并将目录添加到PATH
 * @param installPath
 * @param packageName
 * @param downloadUrl
 * @param mod
 */
function installKooCLIOnLinuxAndMacOS(installPath, packageName, downloadUrl, mod) {
    return __awaiter(this, void 0, void 0, function* () {
        yield tools.execCommand(`sudo mkdir -p ${installPath}`);
        yield tools.execCommand(`sudo chmod -R ${mod} ${installPath}`);
        yield tools.execCommand(`curl -LO ${downloadUrl}`);
        core.info(`extract KooCLI to ${installPath}`);
        yield tools.execCommand(`tar -zxvf ${packageName} -C ${installPath}`);
        core.addPath(installPath);
    });
}
/**
 * 在当前的windows系统上安装KooCLI
 */
function installCLLIOnWindows() {
    return __awaiter(this, void 0, void 0, function* () {
        core.info('current system is Windows.');
        fs.mkdirSync(context.WINDOWS_KOOCLI_PATH);
        const cliPath = yield tc.downloadTool(context.WINDOWS_KOOCLI_URL, `${context.WINDOWS_KOOCLI_PATH}/hcloud.zip`);
        const cliExtractedFolder = yield tc.extractZip(cliPath, context.WINDOWS_KOOCLI_PATH);
        core.addPath(cliExtractedFolder);
    });
}
exports.installCLLIOnWindows = installCLLIOnWindows;
/**
 * 配置KooCLI
 * @returns
 */
function configureKooCLI(ak, sk, region) {
    return __awaiter(this, void 0, void 0, function* () {
        core.info('start configure KooCLI.');
        const args = [`--cli-access-key=${ak}`, `--cli-secret-key=${sk}`];
        if (region) {
            args.push(`--cli-region=${region}`);
        }
        return yield tools.execCommand(`hcloud configure set`, args);
    });
}
exports.configureKooCLI = configureKooCLI;
/**
 * 更新KooCLI
 */
function updateKooCLI() {
    return __awaiter(this, void 0, void 0, function* () {
        core.info('try to update KooCLI.');
        yield tools.execCommand('hcloud update -y');
    });
}
exports.updateKooCLI = updateKooCLI;
/**
 * 根据linux操作系统获得cli下载地址和包名，目前linux支持Linux AMD 64位 和 ARM 64位操作系统
 * @param hostType
 * @returns
 */
function getLinuxKooCLIDownloadInfo(hostType) {
    const downloadInfo = {
        url: '',
        packageName: '',
    };
    if (hostType.includes('aarch64')) {
        downloadInfo.url = context.LINUX_ARM_KOOCLI_URL;
        downloadInfo.packageName = context.LINUX_ARM_KOOCLI_PACKAGE_NAME;
    }
    if (hostType.includes('x86_64')) {
        downloadInfo.url = context.LINUX_AMD_KOOCLI_URL;
        downloadInfo.packageName = context.LINUX_AMD_KOOCLI_PACKAGE_NAME;
    }
    return downloadInfo;
}
/**
 * 根据MacOS操作系统获得cli下载地址和包名，目前MacOS支持MacOS AMD 64位 和 ARM 64位操作系统
 * @param hostType
 * @returns
 */
function getMacOSKooCLIDownloadInfo(hostType) {
    const downloadInfo = {
        url: '',
        packageName: '',
    };
    if (hostType.includes('arm64')) {
        downloadInfo.url = context.MACOS_ARM_KOOCLI_URL;
        downloadInfo.packageName = context.MACOS_ARM_KOOCLI_PACKAGE_NAME;
    }
    if (hostType.includes('x86_64')) {
        downloadInfo.url = context.MACOS_AMD_KOOCLI_URL;
        downloadInfo.packageName = context.MACOS_AMD_KOOCLI_PACKAGE_NAME;
    }
    return downloadInfo;
}
//# sourceMappingURL=install.js.map