import VhiobotApiService from "../vhiobot-api.service";

export default class AnalyticsService {
  constructor(
    private vhiobotApiService: VhiobotApiService = new VhiobotApiService()
  ){}

  async getAnalytics(access_token: string, params?: Record<string, any>){
    const axiosResponse = await this.vhiobotApiService.request(
      `/analytics`,
      {
        headers: {
          'Authorization': `Bearer ${access_token}`
        },
        params
      }
    );
    return axiosResponse;
  }

}