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
const context_1 = require("./context");
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
 * 检查KooCLI是否已经在系统上完成安装，并输出版本
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
 * mac系统安装KooCLI
 */
function installKooCLIOnMacos() {
    return __awaiter(this, void 0, void 0, function* () {
        core.info('current system is MacOS.');
        yield tools.execCommand(`curl -sSL ${context_1.MACOS_KOOCLI_URL} -o ./hcloud_install.sh && bash ./hcloud_install.sh -y`);
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
        const hostType = os.arch();
        const downloadInfo = getLinuxKooCLIDownloadInfo(hostType);
        if (utils.checkParameterIsNull(downloadInfo.url) || utils.checkParameterIsNull(downloadInfo.packageName)) {
            core.info(`KooCLI can be run on Linux AMD64 or Linux Arm64, your system is ${hostType}.`);
            return;
        }
        yield tools.execCommand(`sudo mkdir -p ${context_1.LINUX_KOOCLI_PATH}`);
        fs.chmodSync(context_1.LINUX_KOOCLI_PATH, context_1.LINUX_KOOCLI_MOD);
        yield tools.execCommand(`curl -LO ${downloadInfo.url}`);
        core.info(`extract KooCLI to ${context_1.LINUX_KOOCLI_PATH}`);
        yield tools.execCommand(`tar -zxvf ${downloadInfo.packageName} -C ${context_1.LINUX_KOOCLI_PATH}`);
        core.addPath(context_1.LINUX_KOOCLI_PATH);
    });
}
exports.installKooCLIOnLinux = installKooCLIOnLinux;
/**
 * 在当前的windows系统上安装KooCLI
 */
function installCLLIOnWindows() {
    return __awaiter(this, void 0, void 0, function* () {
        fs.mkdirSync(context_1.WINDOWS_KOOCLI_PATH);
        const cliPath = yield tc.downloadTool(context_1.WINDOWS_KOOCLI_URL, context_1.WINDOWS_KOOCLI_PATH);
        const cliExtractedFolder = yield tc.extractZip(cliPath, context_1.WINDOWS_KOOCLI_PATH);
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
        args.push;
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
    if (hostType === 'aarch64') {
        downloadInfo.url = context_1.LINUX_ARM_KOOCLI_URL;
        downloadInfo.packageName = context_1.LINUX_ARM_KOOCLI_PACKAGE_NAME;
    }
    if (hostType === 'x86_64') {
        downloadInfo.url = context_1.LINUX_AMD_KOOCLI_URL;
        downloadInfo.packageName = context_1.LINUX_AMD_KOOCLI_PACKAGE_NAME;
    }
    return downloadInfo;
}
//# sourceMappingURL=install.js.map