import axios, { Method } from 'axios';
import { NextApiRequest } from 'next';
import { getToken } from 'next-auth/jwt';
import { Env } from '@/common/env';

export default class VhiobotApiService {
  protected accessToken?: string = '';

  constructor(
    config: {
      /**
       * Access token for request to the API. This access token will be used in every request to API
       */ accessToken?: string;
    } = {}
  ) {
    this.accessToken = config.accessToken;
    // console.log(config.accessToken)
  }

  /**
   * You can update the access token for the request using this method
   * @param accessToken Access token from login response
   */
  async setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Set access token from NextApiRequest
   * @param req NextApiRequest
   */
  async setAccessTokenFromNextApiRequest(req: NextApiRequest) {
    const token = (await getToken({ req, secret: Env.NEXTAUTH_SECRET })) as any;
    this.accessToken = token?.account?.access_token;
  }

  /**
   * The universal method to make request to Widya API Apps Host
   * @returns
   */
  async request(
    /**
     * URL that you want to request
     * @example
     * `/users`
     * `/users/1289`
     * @note
     * - You don't need to add the base URL, because it will be added automatically
     */
    url: string,
    config: {
      /**
       * Method for the request
       * @default GET
       */
      method?: Method;
      headers?: Record<string, any>;
      data?: any;
      params?: any;
    } = {}
  ) {
    return await axios.request({
      baseURL: Env.VHIOBOT_API_HOST,
      url: url,
      params: config?.params,
      method: config?.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
        ...(config?.headers ?? {})
      },
      data: config?.data
    });
  }
}
