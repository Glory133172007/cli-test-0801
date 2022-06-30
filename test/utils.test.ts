import * as utils from '../src/utils';
import { expect, test } from '@jest/globals';

// 检查ak/sk
describe('test ak/sk', () => {
    const testCase = [
        {
            description: 'right case',
            ak: 'XGMTYY5SM4CIACVAALLA',
            sk: '2uWJCc9QuL6V6REkN9xresm0TBY5S4KNGTpIwWWb',
            result: true,
        },
        {
            description: 'wrong case',
            ak: '*****Ak',
            sk: '****sadwqerr**',
            result: false,
        },
    ];
    testCase.forEach((item) => {
        const { description, ak, sk, result } = item;
        test(`${description},判断结果：${result}`, () => {
            expect(utils.checkAkSk(ak, sk)).toBe(result);
        });
    });
});

// 检查字符串是否为空
test('test checkParameterIsNull', () => {
    expect(utils.checkParameterIsNull('aa')).toBeFalsy;
    expect(utils.checkParameterIsNull('')).toBeTruthy;
});

// 判断操作命令列表是否为空
test('test checkParameterIsNull', () => {
    expect(utils.checkCommandIsNull(['aa', 'bb'])).toBeFalsy;
    expect(utils.checkCommandIsNull([])).toBeTruthy;
});
