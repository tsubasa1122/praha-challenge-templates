// todo: ここに単体テストを書いてみましょう！
import {
  sumOfArray,
  asyncSumOfArray,
  asyncSumOfArraySometimesZero,
  getFirstNameThrowIfLong,
} from '../functions';
import { NameApiService } from '../nameApiService';
import axios from 'axios';

describe('sumOfArray', () => {
  describe('numberの配列を渡した時', () => {
    it('numberの合計値を返すこと', () => {
      expect(sumOfArray([1, 2])).toBe(3);
      expect(sumOfArray([1, 2, 3])).toBe(6);
    });
  });

  describe('空の配列を渡した時', () => {
    it('例外が発生すること', () => {
      expect(() => sumOfArray([])).toThrow();
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
    it('numberの合計値を返すこと', () => {
      return expect(asyncSumOfArray([1, 2, 3])).resolves.toBe(6);
    });
  });

  describe('空の配列を渡した時', () => {
    it('例外が発生すること', () => {
      return expect(asyncSumOfArray([])).rejects.toThrow();
    });
    it('TypeErrorが発生すること', () => {
      return expect(asyncSumOfArray([])).rejects.toThrow(TypeError);
    });
    it('エラーメッセージが正しいこと', () => {
      return expect(asyncSumOfArray([])).rejects.toThrow(
        'Reduce of empty array with no initial value'
      );
    });
  });
});

describe('asyncSumOfArraySometimesZero', () => {
  // モックを使用している箇所が限定的なので、各ブロック内でモックをクリアすることにした。
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('numberの配列を渡した時', () => {
    // クラスのプロパティが増えた時に一部のプロパティだけをモック化する方法はないのか？(関数の引数にオブジェクトを指定した場合、モック自体にも全てのプロパティを宣言しないとTypeScriptがエラーを出すため) => 直接クラスからインスタンスを生成してモック化する方法でも良さそう。
    const databaseMockSpy = { save: jest.fn() };

    it('numberの合計値を返すこと', () => {
      return asyncSumOfArraySometimesZero([1, 2], databaseMockSpy).then(
        (data) => {
          expect(data).toBe(3);
          expect(databaseMockSpy.save).toBeCalledTimes(1);
        }
      );
    });

    describe('numberの配列を渡した時', () => {
      const databaseMockSpy = { save: jest.fn() };

      it('numberの合計値を返すこと', () => {
        return asyncSumOfArraySometimesZero([1, 2, 3], databaseMockSpy).then(
          (data) => {
            expect(data).toBe(6);
            expect(databaseMockSpy.save).toBeCalledTimes(1);
          }
        );
      });
    });
  });

  describe('sumOfArrayでエラーが発生した時', () => {
    const databaseMockSpy = { save: jest.fn() };

    it('0を返すこと', async () => {
      return asyncSumOfArraySometimesZero([], databaseMockSpy).then((data) => {
        expect(data).toBe(0);
        expect(databaseMockSpy.save).toBeCalledTimes(1);
      });
    });
  });
});

// NameApiServiceクラス全体をモック化する
jest.mock('../NameApiService');
describe('getFirstNameThrowIfLong', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('nameApiSerivceから返されるfirstNameの文字数がmaxNameLength以下の時', () => {
    const nameApiMock = NameApiService as jest.Mock;
    nameApiMock.mockImplementationOnce(() => {
      return {
        getFirstName: jest.fn().mockImplementation(async () => 'あらがき'),
      };
    });
    const axiosInstanceMock = axios.create({});
    const mock = new NameApiService(axiosInstanceMock);
    const maxNameLength = 4;

    it('firstNameを返すこと', async () => {
      await expect(getFirstNameThrowIfLong(maxNameLength, mock)).resolves.toBe(
        'あらがき'
      );
    });
  });

  describe('nameApiSerivceから返されるfirstNameの文字数がmaxNameLengthを超えていた時', () => {
    const nameApiMock = NameApiService as jest.Mock;
    nameApiMock.mockImplementationOnce(() => {
      return {
        getFirstName: jest.fn().mockImplementation(async () => 'あらがき'),
      };
    });
    const axiosInstanceMock = axios.create({});
    const mock = new NameApiService(axiosInstanceMock);
    const maxNameLength = 3;

    it('エラーを返すこと', async () => {
      await expect(
        getFirstNameThrowIfLong(maxNameLength, mock)
      ).rejects.toThrow('first_name too long');
    });
  });
});
