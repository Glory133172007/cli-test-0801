import * as tool from '../src/execTools';
import { expect, test } from '@jest/globals';

describe('check execCommand', () => {
    test('check execCommand when invalid command', async () => {
        expect(async () => await tool.execCommand('command')).toThrow;
    });

    test('check execCommand when valid command', async () => {
        expect(await tool.execCommand('hcloud version')).toBe(true);
    });
});
