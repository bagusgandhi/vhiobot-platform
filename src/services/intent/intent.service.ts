import VhiobotApiService from '../vhiobot-api.service';

export default class IntentService {
  constructor(
    private vhiobotApiService: VhiobotApiService = new VhiobotApiService(),
  ) {}

  async getAllIntent(access_token: string, params?: Record<string, any>) {
    const axiosResponse = await this.vhiobotApiService.request(`/intent`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      params,
    });
    return axiosResponse;
  }

  async getIntentById(access_token: string, intentId: string) {
    const axiosResponse = await this.vhiobotApiService.request(
      `/intent/${intentId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return axiosResponse;
  }

  async updateIntent(access_token: string, intentId: string, data: any) {
    const axiosResponse = await this.vhiobotApiService.request(
      `/intent/${intentId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        method: 'PUT',
        data,
      },
    );
    return axiosResponse;
  }

  async deleteIntent(access_token: string, intentId: string) {
    const axiosResponse = await this.vhiobotApiService.request(
      `/intent/${intentId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        method: 'DELETE',
      },
    );
    return axiosResponse;
  }

  async createIntent(access_token: string, data: any) {
    const axiosResponse = await this.vhiobotApiService.request(
      `/intent`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        method: 'POST',
        data,
      },
    );
    return axiosResponse;
  }
}
