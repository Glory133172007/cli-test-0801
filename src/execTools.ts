import * as core from '@actions/core';
import * as exec from '@actions/exec';

export async function execCommand(commandLine: string, args?: string[]): Promise<boolean> {
    let execSucceed = false;
    try {
        await exec
            .getExecOutput(commandLine, args, {
                ignoreReturnCode: false,
            })
            .then((result) => {
                if (result.exitCode === 0) {
                    execSucceed = true;
                } else if (result.stderr.length > 0) {
                    core.info(result.stderr);
                }
            });
    } catch (error) {
        core.info(`Exec command failed because: ${error}`);
    }
    return execSucceed;
}
