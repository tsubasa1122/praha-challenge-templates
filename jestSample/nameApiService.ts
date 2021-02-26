import { AxiosInstance } from 'axios';

// 以下のように使用する。
// const BASE_URL = 'https://random-data-api.com/api/name/random_name';
// const axiosInstatance = axios.create({
//   baseURL: BASE_URL,
// });
// const nameApiService = new NameApiService(axiosInstatance);

export class NameApiService {
  private MAX_LENGTH = 4;
  // 本当はapiClientみたいなクラスを定義したい
  // private apiClient: apiClient;
  private axiosInstatance: AxiosInstance;
  public constructor(axiosInstatance: AxiosInstance) {
    this.axiosInstatance = axiosInstatance;
  }

  public async getFirstName(): Promise<string> {
    const PATH = '/name/random_name';
    const { data } = await this.axiosInstatance.get(PATH);
    // dataのレスポンスは確認しなくても大丈夫か？
    const firstName = data.first_name as string;

    if (firstName.length > this.MAX_LENGTH) {
      throw new Error('firstName is too long!');
    }

    return firstName;
  }
}
