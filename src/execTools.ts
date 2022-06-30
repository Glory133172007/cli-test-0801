import * as core from '@actions/core';
import * as exec from '@actions/exec';

export async function execCommand(commandLine: string, args?: string[]): Promise<boolean> {
    try {
        await exec
            .getExecOutput(commandLine, args, {
                ignoreReturnCode: false,
            })
            .then((result) => {
                if (result.exitCode !== 0 && result.stderr.length > 0) {
                    core.info(result.stderr);
                    return false;
                }
                return result.exitCode === 0;
            });
    } catch (error) {
        core.info(`Exec command failed because: ${error}`);
        return false;
    }
    return true;
}
