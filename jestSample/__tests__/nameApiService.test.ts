import { NameApiService } from '../nameApiService';
import axios from 'axios';

describe('getFirstName', () => {
  describe('APIからのレスポンスのfirstNameがMAX_LENGTH(4文字)以内の時', () => {
    const apiMockData = { data: { first_name: 'あらがき' } };
    const axiosInstanceMock = axios.create({});
    axiosInstanceMock.get = jest.fn().mockResolvedValue(apiMockData);
    const nameApiService = new NameApiService(axiosInstanceMock);

    it('firstNameを返却すること', async () => {
      await expect(nameApiService.getFirstName()).resolves.toBe('あらがき');
    });
  });

  describe('APIからのレスポンスのfirstNameがMAX_LENGTH(4文字)を超えた時', () => {
    const apiMockData = { data: { first_name: 'あああああ' } };
    const axiosInstanceMock = axios.create({});
    axiosInstanceMock.get = jest.fn().mockResolvedValue(apiMockData);
    const nameApiService = new NameApiService(axiosInstanceMock);

    it('例外が発生すること', async () => {
      await expect(nameApiService.getFirstName()).rejects.toThrow(
        'firstName is too long!'
      );
    });
  });
});
