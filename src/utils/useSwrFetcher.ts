import useSWR, { SWRConfiguration } from 'swr';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { notification } from 'antd';

interface UseSWRFetcherProps {
  key: string | [string, AxiosRequestConfig?] | undefined;
  session?: { data?: { accessToken?: string } };
  swrOptions?: SWRConfiguration;
  axiosOptions?: AxiosRequestConfig;
  allRes?: boolean;
}

export function useSWRFetcher<T>({
  key,
  session,
  swrOptions,
  axiosOptions,
  allRes = false,
}: UseSWRFetcherProps) {
  return useSWR<T>(
    key,
    async (key) => {
      const url = Array.isArray(key) ? key[0] : key;
      const axiosConfig: AxiosRequestConfig = {
        url,
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: { Authorization: `Bearer ${session?.data?.accessToken}` },
        ...((typeof key === 'object' && !Array.isArray(key) && key !== null) && key),
        ...axiosOptions,
      };
      const response: AxiosResponse = await axios(axiosConfig);
      return allRes ? response : response.data;
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onError: (err) => {
        notification['error']({
          message: err?.response?.data?.error ?? 'Error!',
          description: err?.response?.data?.message ?? err?.message,
        });
      },
      ...swrOptions,
    }
  );
}
