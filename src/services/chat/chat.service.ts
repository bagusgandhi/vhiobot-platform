import VhiobotApiService from "../vhiobot-api.service";

export default class ChatService {
  constructor(
    private vhiobotApiService: VhiobotApiService = new VhiobotApiService()
  ){}

  async getChat(access_token: string){
    const axiosResponse = await this.vhiobotApiService.request(
      `/chat`,
      {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      }
    );
    return axiosResponse;
  }

  async getAllChat(access_token: string, params?: Record<string, any>){
    const axiosResponse = await this.vhiobotApiService.request(
      `/chat/all`,
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