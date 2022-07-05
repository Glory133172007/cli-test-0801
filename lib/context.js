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
exports.getInputs = exports.LINUX_AMD_KOOCLI_PACKAGE_NAME = exports.LINUX_AMD_KOOCLI_URL = exports.LINUX_ARM_KOOCLI_PACKAGE_NAME = exports.LINUX_ARM_KOOCLI_URL = exports.WINDOWS_KOOCLI_URL = exports.MACOS_KOOCLI_URL = exports.LINUX_KOOCLI_PATH = exports.WINDOWS_KOOCLI_PATH = exports.LINUX_KOOCLI_MOD = void 0;
const core = __importStar(require("@actions/core"));
exports.LINUX_KOOCLI_MOD = '755';
exports.WINDOWS_KOOCLI_PATH = 'C:/windows/hcloud';
exports.LINUX_KOOCLI_PATH = './usr/hcloud';
exports.MACOS_KOOCLI_URL = 'https://hwcloudcli.obs.cn-north-1.myhuaweicloud.com/cli/latest/hcloud_install.sh';
exports.WINDOWS_KOOCLI_URL = 'https://hwcloudcli.obs.cn-north-1.myhuaweicloud.com/cli/latest/huaweicloud-cli-windows-amd64.zip';
exports.LINUX_ARM_KOOCLI_URL = 'https://hwcloudcli.obs.cn-north-1.myhuaweicloud.com/cli/latest/huaweicloud-cli-linux-arm64.tar.gz';
exports.LINUX_ARM_KOOCLI_PACKAGE_NAME = 'huaweicloud-cli-linux-arm64.tar.gz';
exports.LINUX_AMD_KOOCLI_URL = 'https://hwcloudcli.obs.cn-north-1.myhuaweicloud.com/cli/latest/huaweicloud-cli-linux-amd64.tar.gz';
exports.LINUX_AMD_KOOCLI_PACKAGE_NAME = 'huaweicloud-cli-linux-amd64.tar.gz';
function getInputs() {
    return {
        accessKey: core.getInput('access_key', { required: true }),
        secretKey: core.getInput('secret_key', { required: true }),
        region: core.getInput('region', { required: true }),
        commandList: core.getMultilineInput('command_list', { required: false }),
    };
}
exports.getInputs = getInputs;
//# sourceMappingURL=context.js.map