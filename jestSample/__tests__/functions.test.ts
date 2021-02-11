// todo: ここに単体テストを書いてみましょう！
import { sumOfArray, asyncSumOfArray } from '../functions';

describe('sumOfArray', () => {
  describe('numberの配列を渡した時', () => {
    it('numberの合計値を返すこと', () => {
      expect(sumOfArray([1, 2])).toBe(3);
      expect(sumOfArray([1, 2, 3])).toBe(6);
    });
  });

  describe('空の配列を渡した時', () => {
    it('例外が発生すること', () => {
      expect(() => sumOfArray([])).toThrow(TypeError);
      expect(() => sumOfArray([])).toThrow(
        'Reduce of empty array with no initial value'
      );
    });
  });
});

describe('asyncSumOfArray', () => {
  describe('numberの配列を渡した時', () => {
    it('numberの合計値を返すこと', () => {
      return expect(asyncSumOfArray([1, 2])).resolves.toBe(3);
    });
  });

  describe('空の配列を渡した時', () => {
    it('例外が発生すること', () => {
      expect(asyncSumOfArray([])).rejects.toThrow(TypeError);
      expect(asyncSumOfArray([])).rejects.toThrow(
        'Reduce of empty array with no initial value'
      );
    });
  });
});
